import { observer } from 'mobx-react-lite'
import Style from './Screenshot.module.scss'
import LunaToolbar, {
  LunaToolbarButton,
  LunaToolbarSeparator,
} from 'luna-toolbar/react'
import dataUrl from 'licia/dataUrl'
import toBool from 'licia/toBool'
import convertBin from 'licia/convertBin'
import download from 'licia/download'
import LunaImageViewer from 'luna-image-viewer/react'
import ImageViewer from 'luna-image-viewer'
import ToolbarIcon from '../../../components/ToolbarIcon'
import { useEffect, useRef, useState } from 'react'
import store from '../../store'
import { t } from '../../../lib/util'
import CopyButton from '../../../components/CopyButton'
import { copyData } from '../../lib/util'

export default observer(function Screenshot() {
  const [image, setImage] = useState<string>('')
  const imageViewerRef = useRef<ImageViewer>()

  useEffect(() => {
    recapture()
  }, [])

  function save() {
    const { data } = dataUrl.parse(image)!
    const blob = convertBin(data, 'Blob')
    download(blob, 'screenshot.png', 'image/png')
  }

  function copy() {
    const { data } = dataUrl.parse(image)!
    copyData(data, 'image/png')
  }

  async function recapture() {
    if (store.device) {
      const data = await main.screencap(store.device.id)
      setImage(dataUrl.stringify(data, 'image/png'))
    }
  }

  const hasImage = toBool(image)

  return (
    <div className={Style.container}>
      <LunaToolbar className={Style.toolbar}>
        <ToolbarIcon
          icon="refresh"
          title={t('recapture')}
          onClick={recapture}
          disabled={!toBool(store.device)}
        />
        <ToolbarIcon
          icon="save"
          title={t('save')}
          onClick={save}
          disabled={!hasImage}
        />
        <LunaToolbarButton onClick={() => {}}>
          <CopyButton className="toolbar-icon" onClick={copy} />
        </LunaToolbarButton>
        <LunaToolbarSeparator />
        <ToolbarIcon
          icon="rotate-left"
          title={t('rotate-left')}
          onClick={() => imageViewerRef.current?.rotate(-90)}
          disabled={!hasImage}
        />
        <ToolbarIcon
          icon="rotate-right"
          title={t('rotate-right')}
          onClick={() => imageViewerRef.current?.rotate(90)}
          disabled={!hasImage}
        />
      </LunaToolbar>
      {image && (
        <LunaImageViewer
          className={Style.imageViewer}
          image={image}
          onCreate={(imageViewer) => (imageViewerRef.current = imageViewer)}
        ></LunaImageViewer>
      )}
    </div>
  )
})
