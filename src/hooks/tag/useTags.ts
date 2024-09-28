import { TagsDaemon } from 'src/core/daemons/tags'
import { useDaemon } from '../util/useDaemon'
import { config } from 'src/config'
import { useEffect } from 'preact/hooks'
import { ProfileDaemon } from 'src/core/daemons/profile'

export const useTags = () => {
  const profile = useDaemon(ProfileDaemon)
  const tags = useDaemon(TagsDaemon)

  useEffect(() => {
    const id = setInterval(TagsDaemon.fetch, config.time.update.tags)

    return () => {
      clearInterval(id)
    }
  }, [])

  return { tags, profile }
}
