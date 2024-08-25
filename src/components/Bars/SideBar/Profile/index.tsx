import { Button } from 'src/components/General/Button'
import { Param } from 'src/components/General/Param'
import { WindowBox } from 'src/components/General/WindowBox'
import styles from './index.module.css'
import { ComputedProfileStore, ProfileStore } from 'src/managers/profile'
import { useStore } from 'src/hooks/useStore'
import { UserRole } from 'src/types/api'

export const Profile = () => {
  const profile = useStore(ProfileStore)
  const profileComputed = useStore(ComputedProfileStore)

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

  return profileComputed.isAuthenticated ? (
    <WindowBox title='Профиль'>
      <div class={styles.wrapper}>
        <div className={styles.params}>
          {Object.entries(params).map(([label, value]) => {
            if (!value) return null

            return <Param value={value} label={label} />
          })}
        </div>

        <Button href='/logout'>Выйти</Button>
      </div>
    </WindowBox>
  ) : (
    <div class={styles.login}>
      <Button onClick={() => console.log('v')}>Войти</Button>
    </div>
  )
}
