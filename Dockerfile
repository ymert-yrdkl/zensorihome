# Zensori Home: Next.js standalone imajı.
# Siparişler ve iletişim mesajları /veri klasörüne yazılır; Coolify'da bu klasör kalıcı birime bağlanmalı,
# yoksa her dağıtımda kayıtlar silinir.

FROM node:24-alpine AS bagimliliklar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-alpine AS derleme
WORKDIR /app
# Paylaşım ve site haritası adresleri derleme anında yazılır
ARG NEXT_PUBLIC_SITE_ADRESI=https://zensorihomecom.ahmcloud.com
ARG NEXT_PUBLIC_DEMO_MODU=1
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_ADRESI=$NEXT_PUBLIC_SITE_ADRESI \
    NEXT_PUBLIC_DEMO_MODU=$NEXT_PUBLIC_DEMO_MODU
COPY --from=bagimliliklar /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS calisma
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    VERI_DIZINI=/veri
RUN addgroup -S zensori && adduser -S zensori -G zensori && mkdir -p /veri && chown zensori:zensori /veri
COPY --from=derleme --chown=zensori:zensori /app/public ./public
COPY --from=derleme --chown=zensori:zensori /app/.next/standalone ./
COPY --from=derleme --chown=zensori:zensori /app/.next/static ./.next/static
# Görsel iyileştirici (sharp) için Linux kütüphaneleri: standalone izleyicisi her zaman kopyalamıyor
COPY --from=derleme --chown=zensori:zensori /app/node_modules/@img ./node_modules/@img
USER zensori
VOLUME ["/veri"]
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/saglik >/dev/null || exit 1
CMD ["node", "server.js"]
