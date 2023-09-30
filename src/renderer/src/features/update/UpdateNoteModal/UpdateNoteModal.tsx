import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Modal } from 'antd'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import useSWRImmutable from 'swr/immutable'

import { publish } from '@renderer/../../../electron-builder.json'
import { appUpdateAtom } from '@renderer/stores/atoms/appUpdate.atom'

import * as Styled from './UpdateNoteModal.styled'

interface UpdateNoteModal {
  open?: boolean
  onClose?: () => void
}

/**
 * 앱 업데이트 노트 모달
 *
 * `props.open` 값을 `false`, `true`로 설정하면 직접 모달을 열고 닫을 수 있습니다.
 * 만약 값을 설정하지 않으면 업데이트 될 때 자동으로 열립니다.
 */
const UpdateNoteModal = ({ open, onClose }: UpdateNoteModal) => {
  const { t } = useTranslation()

  const [modal, contextHolder] = Modal.useModal()
  const { version } = useAtomValue(appUpdateAtom)

  const { data } = useSWRImmutable(
    `https://api.github.com/repos/${publish[0].owner}/${publish[0].repo}/releases/latest`,
    async url => {
      const { data } = await axios.get(url)
      return data
    },
  )

  const openModal = () => {
    modal.info({
      icon: null,
      width: 600,
      title: `v${version} ${t('renderer.updateNote')}`,
      closable: true,
      maskClosable: true,
      content: (
        <Styled.Root className="UpdateNoteModal">
          {data.body
            .replaceAll('\r', '')
            .split('\n')
            .filter((x: string) => x.length > 0)
            .map((line: string, index: number) => {
              const text = line.replace(/@.+/, '')

              return (
                <Fragment key={index}>
                  {text.startsWith('##') ? <h2>{text.replace('##', '')}</h2> : <p>{text}</p>}
                </Fragment>
              )
            })}
        </Styled.Root>
      ),
      onCancel: () => {
        onClose?.()
      },
      onOk: () => {
        onClose?.()
      },
    })
  }

  useEffect(() => {
    if (open) {
      openModal()
    } else if (
      open === undefined &&
      data &&
      localStorage.getItem('recentViewedUpdateNoteVersion') !== version
    ) {
      openModal()
      localStorage.setItem('recentViewedUpdateNoteVersion', version)
    }
  }, [data, open])

  return contextHolder
}

export default UpdateNoteModal
