import { ProfileDaemon } from 'src/core/daemons/profile'
import { useDaemon } from './util/useDaemon'
import { UserRole } from 'src/core/classes/api/types'
import { config } from 'src/config'

export const useProfile = () => {
  const profile = useDaemon(ProfileDaemon)

  const params = {
    Имя: profile.user?.username,
    Айди: profile.user?.userID,
    Тег: profile.user?.tag,
    Статус: profile.user?.banned
      ? `Забанен по причине "${profile.user?.banned.reason ?? 'Не указано'}"`
      : null,
    Роль: {
      [UserRole.User]: null,
      [UserRole.Moderator]: 'Модератор',
      [UserRole.Admin]: 'Админ'
    }[profile.user?.role ?? UserRole.User]
  }

  const login = () => {
    const redirectUrl = new URLSearchParams({
      client_id: config.discord.clientId,
      redirect_uri: config.discord.redirectUri,
      response_type: 'code',
      scope: config.discord.scope.join(' ')
    })

    window.location.replace(
      //`https://discord.com/api/oauth2/authorize?${redirectUrl}`
      `http://localhost:9000/login`
    )
  }

  return { params, profile, login }
}
