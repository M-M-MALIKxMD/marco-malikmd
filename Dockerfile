FROM node:20-slim

# Build tools + system libraries — sharp, ffmpeg-static کے لیے ضروری
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    make \
    g++ \
    gcc \
    wget \
    curl \
    ca-certificates \
    libvips-dev \
    libvips42 \
    fonts-noto \
    fonts-noto-color-emoji \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Sharp کو system libvips استعمال کرنے دیں — download نہ کرے
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=0
ENV npm_config_sharp_binary_host="https://npmmirror.com/mirrors/sharp"

# ffmpeg system والا استعمال ہو
ENV FFMPEG_PATH=/usr/bin/ffmpeg

# پہلے package.json copy کریں
COPY package.json ./

# Dependencies install کریں
RUN npm install --legacy-peer-deps --no-audit --no-fund

# باقی سب files copy کریں
COPY . .

# ضروری folders بنائیں
RUN mkdir -p auth_info tmp

EXPOSE 3000

# Bot چلائیں
CMD ["node", "index.js"]
