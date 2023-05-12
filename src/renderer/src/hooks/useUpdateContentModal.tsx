import { Fragment, useEffect, useState } from 'react'

import { Modal } from 'antd'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import useSWRImmutable from 'swr/immutable'

import { publish } from '@renderer/../../../electron-builder.json'
import { updateStore } from '@renderer/stores/update'

const UpdateContentModalStyled = styled.div`
  margin-bottom: 2rem;
  margin-top: 1.5rem;

  h2 {
    font-size: 0.9rem;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
  }

  p {
    margin-bottom: 0;
    padding-left: 2rem;
  }
`

export interface UseUpdateContentModalOptions {
  autoOpen?: boolean
}

export const useUpdateContentModal = (options: UseUpdateContentModalOptions = {}) => {
  const { version } = useRecoilValue(updateStore)
  const [_open, _setOpen] = useState(localStorage.getItem('lastUpdateContentVersion') !== version)

  const { data } = useSWRImmutable(
    `https://api.github.com/repos/${publish[0].owner}/${publish[0].repo}/releases/latest`,
    async url => {
      const { data } = await axios.get(url)
      return data
    },
  )

  const open = () => {
    Modal.info({
      icon: null,
      width: 600,
      title: `v${version} 업데이트 내역`,
      closable: true,
      maskClosable: true,
      content: (
        <UpdateContentModalStyled className="UpdateContentModal">
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
        </UpdateContentModalStyled>
      ),
    })
  }

  useEffect(() => {
    if (options.autoOpen && data && localStorage.getItem('lastUpdateContentVersion') !== version) {
      open()
      localStorage.setItem('lastUpdateContentVersion', version)
    }
  }, [data, options.autoOpen])

  return {
    open,
  }
}
