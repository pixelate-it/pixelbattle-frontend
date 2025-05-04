import { Button } from 'src/components/General/Button'
import { Param } from 'src/components/General/Param'
import { WindowBox } from 'src/components/General/WindowBox'
import { useProfile } from 'src/hooks/useProfile'
import styles from './index.module.styl'

export const Profile = () => {
  const { params, profile, login } = useProfile()

  return profile.isAuthenticated ? (
    <WindowBox title='Профиль'>
      <div class={styles.wrapper}>
        {profile.user !== null ? (
          <>
            <div className={styles.params}>
              {Object.entries(params).map(([label, value]) => {
                if (!value) return null

                return <Param value={value} label={label} />
              })}
            </div>

            <Button href='/logout'>Выйти</Button>
          </>
        ) : (
          <>
            {/* Mirdukkkkk please make styles for this! */}
            <p>Загрузка профиля...</p>
          </>
        )}
      </div>
    </WindowBox>
  ) : (
    <div class={styles.login}>
      <Button onClick={login}>Войти</Button>
    </div>
  )
}
