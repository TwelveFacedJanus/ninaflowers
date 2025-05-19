FROM postgres:latest

ENV POSTGRES_USER=superuser
ENV POSTGRES_PASSWORD=superpassword
ENV POSTGRES_DB=ninaflowers_db

RUN mkdir -p /docker-entrypoint-initdb.d

EXPOSE 5432

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

VOLUME /var/lib/postgresql/data
