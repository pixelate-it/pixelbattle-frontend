import Color from './core/util/сolor'

export const config = {
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
    ws: 6000,
    notificationRemoved: 3000,
    pixelInfo: 500,
    palette: {
      deleteButtonPress: 2000
    }
  },
  ws: {
    reconnectAttempts: 10
  },
  defaults: {
    colors: {
      background: '#282828',
      palette: {
        colors: [
          new Color('#ff0000'),
          new Color('#00ff00'),
          new Color('#0000ff'),
          new Color('#000000'),
          new Color('#ffffff')
        ],
        selected: new Color('#ffffff')
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
    max: 300,
    min: 0.5
  },
  cooldown: {
    offset: 50,
    staff: 50
  },
  overlay: {
    defaultOpacity: 60,
    pressToEditModeDelay: 1000
  },
  picker: {
    pressDelay: 500
  }
}
