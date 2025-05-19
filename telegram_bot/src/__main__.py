import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher, html, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import InputFile, PhotoSize
from aiogram.filters import Command
import base64
from io import BytesIO
from aiogram.types import ContentType
import tempfile
import os
from aiogram.types import InputFile

from crud import ManageUsers, ManageBouquets
from models import Users

class AuthStages(StatesGroup):
    waiting_for_token = State()

class AddUserStages(StatesGroup):
    waiting_for_telegram_id = State()
    waiting_for_role = State()

class AddBouquetStages(StatesGroup):
    waiting_for_photo = State()
    waiting_for_name = State()
    waiting_for_description = State()
    waiting_for_price = State()

class RemoveBouquetStages(StatesGroup):
    waiting_for_bouquet_id = State()

class EditBouquetStages(StatesGroup):
    waiting_for_bouquet_id = State()
    waiting_for_edit_choice = State()
    waiting_for_new_value = State()

async def set_default_user():
    if await ManageUsers.find_user_by_id(user_id='6111027096') is None:
        await ManageUsers.set_user(user=Users(telegram_id='6111027096', phone_number='None', role='tech', auth_token='HBVGVgvwdfyghbBAHSDBVh1512'))
    else:
        print("Default user already exists.")

BOT_API_TOKEN: str = '7647382898:AAGjUFJD4xcA_57f8rxkXElMzatJIsEqNqA'

dp = Dispatcher()

async def get_main_keyboard(user_id: int) -> ReplyKeyboardMarkup:
    user = await ManageUsers.find_user_by_id(user_id)
    
    # Базовые кнопки, доступные всем
    buttons = [
        [KeyboardButton(text="Посмотреть букеты")],
        [KeyboardButton(text="Добавить букет")],
        [KeyboardButton(text="Удалить букет")],
        [KeyboardButton(text="Изменить букет")],
        [KeyboardButton(text="Заказы")]
    ]
    
    # Добавляем кнопки администрирования, если у пользователя нужная роль
    if user and user.role in ['admin', 'tech']:
        admin_buttons = [
            KeyboardButton(text="Добавить пользователя"),
            KeyboardButton(text="Удалить пользователя")
        ]
        buttons.insert(0, admin_buttons)
    
    return ReplyKeyboardMarkup(
        keyboard=buttons,
        resize_keyboard=True,
        input_field_placeholder="Выберите действие"
    )

@dp.message(F.text == "Удалить букет")
async def handle_remove_bouquet(message: Message, state: FSMContext):
    # Проверяем права пользователя
    user = await ManageUsers.find_user_by_id(message.from_user.id)
    if not user or user.role not in ['admin', 'tech', 'florist']:
        await message.answer("⛔ У вас недостаточно прав для выполнения этой операции.")
        return
    
    # Получаем список букетов для выбора
    bouquets = await ManageBouquets.get_all_bouquets()
    if not bouquets:
        await message.answer("📭 Список букетов пуст.")
        return
    
    # Формируем список букетов для выбора
    bouquets_list = "\n".join([f"{bouquet['id']}: {bouquet['name']}" for bouquet in bouquets])
    await message.answer(f"Введите ID букета для удаления:\n\n{bouquets_list}")
    await state.set_state(RemoveBouquetStages.waiting_for_bouquet_id)

@dp.message(RemoveBouquetStages.waiting_for_bouquet_id)
async def process_remove_bouquet(message: Message, state: FSMContext):
    try:
        bouquet_id = int(message.text.strip())
        success = await ManageBouquets.remove_bouquet(bouquet_id)
        
        if success:
            await message.answer("✅ Букет успешно удален!", reply_markup=await get_main_keyboard(message.from_user.id))
        else:
            await message.answer("❌ Букет с указанным ID не найден.")
    except ValueError:
        await message.answer("❌ Пожалуйста, введите числовой ID букета.")
    finally:
        await state.clear()

@dp.message(F.text == "Изменить букет")
async def handle_edit_bouquet(message: Message, state: FSMContext):
    # Проверяем права пользователя
    user = await ManageUsers.find_user_by_id(message.from_user.id)
    if not user or user.role not in ['admin', 'tech', 'florist']:
        await message.answer("⛔ У вас недостаточно прав для выполнения этой операции.")
        return
    
    # Получаем список букетов для выбора
    bouquets = await ManageBouquets.get_all_bouquets()
    if not bouquets:
        await message.answer("📭 Список букетов пуст.")
        return
    
    # Формируем список букетов для выбора
    bouquets_list = "\n".join([f"{bouquet['id']}: {bouquet['name']}" for bouquet in bouquets])
    await message.answer(f"Введите ID букета для изменения:\n\n{bouquets_list}")
    await state.set_state(EditBouquetStages.waiting_for_bouquet_id)

@dp.message(EditBouquetStages.waiting_for_bouquet_id)
async def process_edit_bouquet_id(message: Message, state: FSMContext):
    try:
        bouquet_id = int(message.text.strip())
        bouquet = await ManageBouquets.get_bouquet_by_id(bouquet_id)
        
        if not bouquet:
            await message.answer("❌ Букет с указанным ID не найден.")
            await state.clear()
            return
        
        await state.update_data(bouquet_id=bouquet_id)
        
        # Создаем клавиатуру для выбора поля для изменения
        edit_keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="Название")],
                [KeyboardButton(text="Описание")],
                [KeyboardButton(text="Цена")],
                [KeyboardButton(text="Фото")],
                [KeyboardButton(text="Отмена")]
            ],
            resize_keyboard=True
        )
        
        await message.answer(
            f"Выберите что изменить в букете {bouquet['name']}:",
            reply_markup=edit_keyboard
        )
        await state.set_state(EditBouquetStages.waiting_for_edit_choice)
        
    except ValueError:
        await message.answer("❌ Пожалуйста, введите числовой ID букета.")

@dp.message(EditBouquetStages.waiting_for_edit_choice)
async def process_edit_choice(message: Message, state: FSMContext):
    choice = message.text.strip().lower()
    
    if choice == "отмена":
        await state.clear()
        await message.answer("Изменение отменено.", reply_markup=await get_main_keyboard(message.from_user.id))
        return
    
    valid_choices = ["название", "описание", "цена", "фото"]
    if choice not in valid_choices:
        await message.answer("❌ Пожалуйста, выберите один из предложенных вариантов.")
        return
    
    await state.update_data(edit_choice=choice)
    
    if choice == "фото":
        await message.answer("Пожалуйста, отправьте новое фото букета:")
    else:
        await message.answer(f"Введите новое значение для {choice}:")
    
    await state.set_state(EditBouquetStages.waiting_for_new_value)

@dp.message(EditBouquetStages.waiting_for_new_value, F.content_type == ContentType.PHOTO)
async def process_new_photo(message: Message, state: FSMContext):
    data = await state.get_data()
    if data.get('edit_choice') != 'фото':
        await message.answer("❌ Ожидалось текстовое значение. Пожалуйста, начните заново.")
        await state.clear()
        return
    
    try:
        photo = message.photo[-1]
        photo_file = await message.bot.get_file(photo.file_id)
        photo_bytes = await message.bot.download_file(photo_file.file_path)
        image_base64 = base64.b64encode(photo_bytes.read()).decode('utf-8')
        
        update_data = {
            'photo_file_id': photo.file_id,
            'photo_base64': image_base64
        }
        
        success = await ManageBouquets.update_bouquet(data['bouquet_id'], update_data)
        
        if success:
            await message.answer("✅ Фото букета успешно обновлено!", reply_markup=await get_main_keyboard(message.from_user.id))
        else:
            await message.answer("❌ Ошибка при обновлении фото букета.")
    except Exception as e:
        await message.answer(f"❌ Ошибка при обработке фото: {str(e)}")
    finally:
        await state.clear()

@dp.message(EditBouquetStages.waiting_for_new_value)
async def process_new_value(message: Message, state: FSMContext):
    data = await state.get_data()
    choice = data.get('edit_choice')
    new_value = message.text.strip()
    
    update_data = {}
    
    if choice == "название":
        update_data['name'] = new_value
    elif choice == "описание":
        update_data['description'] = new_value
    elif choice == "цена":
        try:
            update_data['price'] = int(new_value)
            if update_data['price'] <= 0:
                raise ValueError
        except ValueError:
            await message.answer("❌ Цена должна быть положительным числом. Пожалуйста, попробуйте снова.")
            return
    
    success = await ManageBouquets.update_bouquet(data['bouquet_id'], update_data)
    
    if success:
        await message.answer(f"✅ {choice.capitalize()} букета успешно обновлено!", reply_markup=await get_main_keyboard(message.from_user.id))
    else:
        await message.answer(f"❌ Ошибка при обновлении {choice} букета.")
    
    await state.clear()


@dp.message(F.text == "Посмотреть букеты")
async def view_bouquets(message: Message):
    try:
        bouquets = await ManageBouquets.get_all_bouquets()
        if not bouquets:
            await message.answer("📭 Список букетов пуст.")
            return
            
        for bouquet in bouquets:
            caption = (
                f"💐 {bouquet['name']}\n\n"
                f"📝 Описание: {bouquet['description']}\n"
                f"💰 Цена: {bouquet['price']:,} руб.".replace(",", " ")
            )
            
            # First try to use file_id if available
            if bouquet.get('photo_file_id'):
                try:
                    await message.answer_photo(
                        photo=bouquet['photo_file_id'],
                        caption=caption
                    )
                    continue
                except Exception as e:
                    logging.warning(f"Failed to send using file_id: {e}")
            
            # Fall back to base64 if file_id fails or doesn't exist
            if bouquet.get('photo_base64'):
                try:
                    photo_bytes = base64.b64decode(bouquet['photo_base64'])
                    # Create temporary file
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                        tmp.write(photo_bytes)
                        tmp_path = tmp.name
                    
                    # Send using file path
                    await message.answer_photo(
                        photo=InputFile(tmp_path),
                        caption=caption
                    )
                    # Clean up
                    os.unlink(tmp_path)
                except Exception as e:
                    logging.error(f"Error processing photo for bouquet {bouquet.get('id')}: {str(e)}")
                    await message.answer(
                        text=f"❌ Не удалось отобразить фото для букета {bouquet['name']}\n\n{caption}"
                    )
            else:
                await message.answer(text=caption)
                
    except Exception as e:
        logging.exception("Error in view_bouquets")
        await message.answer(f"❌ Произошла ошибка при получении списка букетов: {str(e)}")

@dp.message(F.text == "Добавить пользователя")
async def handle_add_user_request(message: Message, state: FSMContext):
    # Проверяем роль пользователя
    user = await ManageUsers.find_user_by_id(message.from_user.id)
    
    if not user or user.role not in ['admin', 'tech']:
        await message.answer("⛔ У вас недостаточно прав для выполнения этой операции.")
        return
    
    await message.answer("Введите Telegram ID нового пользователя:")
    await state.set_state(AddUserStages.waiting_for_telegram_id)

@dp.message(AddUserStages.waiting_for_telegram_id)
async def process_telegram_id(message: Message, state: FSMContext):
    telegram_id = message.text.strip()
    
    # Проверяем валидность ID
    if not telegram_id.isdigit():
        await message.answer("❌ Неверный формат ID. Пожалуйста, введите числовой Telegram ID:")
        return
    
    # Сохраняем ID в состоянии
    await state.update_data(telegram_id=telegram_id)
    
    # Создаем клавиатуру с доступными ролями
    roles_keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="user")],
            [KeyboardButton(text="florist")],
            [KeyboardButton(text="tech")] + ([KeyboardButton(text="admin")] if (await ManageUsers.find_user_by_id(message.from_user.id)).role == 'admin' else [])
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    
    await message.answer("Выберите роль нового пользователя:", reply_markup=roles_keyboard)
    await state.set_state(AddUserStages.waiting_for_role)

@dp.message(AddUserStages.waiting_for_role)
async def process_role(message: Message, state: FSMContext):
    role = message.text.strip().lower()
    current_user = await ManageUsers.find_user_by_id(message.from_user.id)
    
    # Проверяем допустимость роли
    allowed_roles = ['user', 'tech', 'florist']
    if current_user.role == 'admin':
        allowed_roles.append('admin')
    
    if role not in allowed_roles:
        await message.answer(f"❌ Недопустимая роль. Выберите из: {', '.join(allowed_roles)}")
        return
    
    # Получаем сохраненные данные
    data = await state.get_data()
    telegram_id = data['telegram_id']
    
    # Создаем нового пользователя
    new_user = Users(
        telegram_id=telegram_id,
        phone_number=None,
        role=role,
        auth_token=None  # Можно сгенерировать токен автоматически
    )
    
    try:
        await ManageUsers.set_user(user=new_user)
        await message.answer(f"✅ Пользователь с ID {telegram_id} успешно добавлен с ролью {role}!", 
                           reply_markup=await get_main_keyboard(message.from_user.id))
    except Exception as e:
        await message.answer(f"❌ Ошибка при добавлении пользователя: {str(e)}")
    
    await state.clear()

@dp.message(CommandStart())
async def command_start_handler(message: Message, state: FSMContext) -> None:
    await message.answer("Привет, меня зовут Фрирен! Я буду помогать тебе с твоей работой!")
    await asyncio.sleep(1)
    await message.answer("Для начала, тебе нужно ввести токен авторизации. Его ты можешь взять у tg://user?id=6111027096")
    if await ManageUsers.find_user_by_id(message.from_user.id) is None:
        await ManageUsers.set_user(user=Users(telegram_id=str(message.from_user.id), phone_number=None))
    await state.set_state(AuthStages.waiting_for_token)

@dp.message(AuthStages.waiting_for_token)
async def process_token(message: Message, state: FSMContext) -> None:
    user_token = message.text.strip()

    if await validate_token(user_token, message.from_user.id):
        keyboard = await get_main_keyboard(message.from_user.id)
        await message.answer("✅ Токен принят! Теперь ты авторизован.", reply_markup=keyboard)
        await state.clear()
        await message.answer("Теперь ты можешь пользоваться всеми моими возможностями", reply_markup=keyboard)
    else:
        await message.answer("❌ Неверный токен. Пожалуйста, попробуй еще раз.")

@dp.message(F.text == "Добавить букет")
async def handle_add_bouquet(message: Message, state: FSMContext):
    await message.answer("Пожалуйста, отправьте фото букета:")
    await state.set_state(AddBouquetStages.waiting_for_photo)

@dp.message(AddBouquetStages.waiting_for_photo, F.content_type == ContentType.PHOTO)
async def process_bouquet_photo(message: Message, state: FSMContext):
    try:
        photo = message.photo[-1]
        
        # Сохраняем file_id для повторного использования
        await state.update_data(photo_file_id=photo.file_id)
        
        # Дополнительно сохраняем в base64 если нужно
        photo_file = await message.bot.get_file(photo.file_id)
        photo_bytes = await message.bot.download_file(photo_file.file_path)
        image_base64 = base64.b64encode(photo_bytes.read()).decode('utf-8')
        await state.update_data(photo_base64=image_base64)
        
        await message.answer("Фото успешно получено! Теперь введите название букета:")
        await state.set_state(AddBouquetStages.waiting_for_name)
        
    except Exception as e:
        await message.answer("❌ Ошибка при обработке фото. Пожалуйста, попробуйте еще раз.")
        await state.clear()

@dp.message(AddBouquetStages.waiting_for_photo)
async def process_bouquet_photo_invalid(message: Message):
    await message.answer("Пожалуйста, отправьте именно фото букета.")

@dp.message(AddBouquetStages.waiting_for_name)
async def process_bouquet_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    await message.answer("Теперь введите описание букета:")
    await state.set_state(AddBouquetStages.waiting_for_description)

@dp.message(AddBouquetStages.waiting_for_description)
async def process_bouquet_description(message: Message, state: FSMContext):
    await state.update_data(description=message.text)
    await message.answer("Введите стоимость букета (только цифры, например: 2500):")
    await state.set_state(AddBouquetStages.waiting_for_price)

@dp.message(AddBouquetStages.waiting_for_price)
async def process_bouquet_price(message: Message, state: FSMContext):
    try:
        price = int(message.text.strip())
        if price <= 0:
            raise ValueError
    except ValueError:
        await message.answer("❌ Пожалуйста, введите корректную стоимость (целое число больше 0):")
        return

    await state.update_data(price=price)

    data = await state.get_data()

    try:
        # Получаем file_id из состояния (если сохранили при загрузке)
        if 'photo_file_id' in data:
            # Используем уже загруженное фото через file_id
            await message.answer_photo(
                photo=data['photo_file_id'],
                caption=(
                    f"✅ Букет успешно добавлен!\n\n"
                    f"Название: {data['name']}\n"
                    f"Описание: {data['description']}\n"
                    f"Стоимость: {price:,} руб.".replace(",", " ")
                ),
                reply_markup=await get_main_keyboard(message.from_user.id),
            )
        else:
            # Альтернативный вариант без отправки фото
            await message.answer(
                text=(
                    f"✅ Букет успешно добавлен!\n\n"
                    f"Название: {data['name']}\n"
                    f"Описание: {data['description']}\n"
                    f"Стоимость: {price:,} руб.".replace(",", " ")
                ),
                reply_markup=await get_main_keyboard(message.from_user.id),
            )

        await ManageBouquets.add_bouquet(data)
        
    except Exception as e:
        await message.answer(f"❌ Ошибка при сохранении букета: {str(e)}")
        logging.exception("Ошибка при обработке букета")
    
    await state.clear()

# Добавляем обработчик команды /cancel для отмены любого действия
@dp.message(Command("cancel"))
@dp.message(F.text.casefold() == "отмена")
async def cancel_handler(message: Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state is None:
        return
    
    await state.clear()
    await message.answer(
        "Действие отменено.",
        reply_markup=await get_main_keyboard(message.from_user.id)
    )

async def validate_token(token: str, user_id: int) -> bool:
    return await ManageUsers.check_token_by_user_id(user_id, token)

async def main() -> None:
    bot = Bot(token=BOT_API_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await set_default_user()
    await dp.start_polling(bot)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
