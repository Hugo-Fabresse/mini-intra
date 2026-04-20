# PocketBase Backend
# Image legere Alpine avec le binaire PocketBase

FROM alpine:3.23 AS downloader

ARG PB_VERSION=0.25.9
ARG TARGETARCH=amd64

RUN apk add --no-cache wget unzip \
    && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
       -O /tmp/pocketbase.zip \
    && unzip /tmp/pocketbase.zip -d /tmp/pocketbase \
    && rm /tmp/pocketbase.zip

FROM alpine:3.23

# Securite : utilisateur non-root
RUN addgroup -S pocketbase && adduser -S pocketbase -G pocketbase

COPY --from=downloader /tmp/pocketbase/pocketbase /usr/local/bin/pocketbase
RUN chmod +x /usr/local/bin/pocketbase

RUN mkdir -p /pb/pb_data && chown -R pocketbase:pocketbase /pb

USER pocketbase
WORKDIR /pb

EXPOSE 8090

CMD ["pocketbase", "serve", "--http=0.0.0.0:8090"]
