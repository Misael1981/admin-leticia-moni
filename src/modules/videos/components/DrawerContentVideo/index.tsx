import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

type DrawerContentVideoProps = {
  videoTitle: string
  videoDescription: string | null
  videoDate: Date
  isOpen: boolean
  onClose: () => void
}

const DrawerContentVideo = ({
  videoDate,
  videoDescription,
  videoTitle,
  isOpen,
  onClose,
}: DrawerContentVideoProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[70vh] border-0 sm:inset-x-auto! sm:left-1/2! sm:w-full! sm:max-w-md! sm:-translate-x-1/2! sm:rounded-2xl!">
        <DrawerHeader>
          <DrawerTitle>{videoTitle}</DrawerTitle>
          <DrawerDescription>
            {new Date(videoDate).toLocaleDateString("pt-BR")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {videoDescription && (
            <p className="text-sm whitespace-pre-line">{videoDescription}</p>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="destructive">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerContentVideo
