export const AppConfig = {
  discord: {
    clientId: import.meta.env.VITE_DISCORD_BOT_ID,
    redirectUri: import.meta.env.VITE_DISCORD_BOT_REDIRECT,
    scope: ['identify', 'guilds.join', 'email']
  },
  url: {
    api: import.meta.env.VITE_BACKEND
  },
  time: {
    update: {
      tags: 30000,
      info: 30000
    },
    ws: 2000,
    notificationRemoved: 3000,
    pixelInfo: 500
  },
  defaults: {
    colors: {
      background: '#282828',
      palette: {
        colors: ['#ff0000', '#00ff00', '#0000ff', '#000000', '#ffffff']
      },
      selected: '#ffffff'
    }
  },
  media: {
    youtube: ['https://youtube.pixelbattle.fun', 'YouTube канал Pixelate It!'],
    discord: ['https://discord.pixelbattle.fun', 'Discord-сервер Pixelate It!'],
    github: ['https://github.pixelbattle.fun', 'GitHub Pixelate It!'],
    help: ['https://help.pixelbattle.fun', 'Страница помощи']
  },
  chunks: {
    chunkWidth: 100,
    chunkHeight: 100,
    chunkUpdateCountdown: 200
  }
}
