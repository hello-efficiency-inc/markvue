
interface ElectronApi {
  readonly ipcRendReceiveOnce: (channel: string, func: any) => void
  readonly ipcRendReceive: (channel: string, func: any) => void
  readonly ipcSendData: (data: string) => void
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
