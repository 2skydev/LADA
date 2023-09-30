import { ReactNode, useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Popconfirm, Space } from 'antd'
import clsx from 'clsx'
import deepEqual from 'fast-deep-equal'
import { AnimatePresence } from 'framer-motion'

import { UseCustomUseFormReturn } from '@renderer/hooks/useCustomForm'

import * as Styled from './SaveButton.styled'

export interface SaveButtonProps {
  form: UseCustomUseFormReturn<any, any>
  defaultValues: any
  className?: string
  confirmText?: ReactNode
  useConfirm?: boolean
}

const animation = {
  initial: {
    opacity: 0,
    y: 100,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: 100,
    transition: {
      ease: 'backIn',
    },
  },

  transition: {
    duration: 0.3,
    ease: 'backOut',
  },
}

let timeoutHandle: NodeJS.Timeout

const SaveButton = ({
  form,
  className,
  defaultValues,
  confirmText,
  useConfirm = false,
}: SaveButtonProps) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.form.save',
  })

  const [invalid, setInvalid] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const values = useWatch({
    control: form.control,
  })

  const isEqual = deepEqual(defaultValues, values)

  const handleSave = async () => {
    setLoading(true)

    const valid = await form.submit()

    if (!valid) {
      setInvalid(true)
    }

    setLoading(false)
  }

  useEffect(() => {
    clearTimeout(timeoutHandle)

    if (invalid) {
      timeoutHandle = setTimeout(() => {
        setInvalid(false)
      }, 1000)
    }
  }, [invalid])

  return (
    <AnimatePresence>
      {!isEqual && (
        <Styled.Root
          className={clsx('SaveButton', className, { invalid })}
          key="SaveButton"
          {...animation}
        >
          <span>{t('title')}</span>

          <Space>
            <Button className="cancel" disabled={loading} onClick={() => form.reset(defaultValues)}>
              {t('rollback')}
            </Button>

            <Popconfirm
              title={confirmText || t('confirm.title')}
              okText={t('confirm.ok')}
              cancelText={t('confirm.cancel')}
              placement="topRight"
              open={confirmVisible}
              onOpenChange={(visible: boolean) => {
                if (useConfirm) {
                  setConfirmVisible(visible)
                }
              }}
              onConfirm={() => {
                handleSave()
                setConfirmVisible(false)
              }}
            >
              <Button
                className="save"
                type="primary"
                loading={loading}
                onClick={useConfirm ? undefined : handleSave}
              >
                {t('ok')}
              </Button>
            </Popconfirm>
          </Space>
        </Styled.Root>
      )}
    </AnimatePresence>
  )
}

export default SaveButton
