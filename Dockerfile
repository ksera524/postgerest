# ベースイメージとしてNode.jsを使用
FROM node:18 AS build

# 作業ディレクトリを作成
WORKDIR /app

# package.json と package-lock.json をコンテナにコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコンテナにコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 軽量なNginxイメージを使用
FROM nginx:alpine

# ビルド成果物をNginxのデフォルトの公開ディレクトリにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxの設定ファイルをコピー（必要に応じてカスタマイズ）
COPY nginx.conf /etc/nginx/nginx.conf

# コンテナがリッスンするポートを指定
EXPOSE 80

# コンテナ起動時に実行されるコマンド
CMD ["nginx", "-g", "daemon off;"]
