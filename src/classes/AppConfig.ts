import { AppColor } from './AppCanvas/AppColor'

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
        colors: [
          new AppColor('#ff0000'),
          new AppColor('#00ff00'),
          new AppColor('#0000ff'),
          new AppColor('#000000'),
          new AppColor('#ffffff')
        ],
        selected: new AppColor('#ffffff')
      }
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
  },
  zoom: {
    max: 200,
    min: 0.5
  },
  cooldown: {
    offset: 50,
    staff: 50
  }
}
