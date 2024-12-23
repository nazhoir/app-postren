import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {CreateEducationHistoryForm} from './form'
  
export  function CreateEducationHistorySheet() {
  return (
    <Sheet>
  <SheetTrigger asChild>
    <Button size={"sm"} className='ml-auto'>
        <Plus className='h-4 w-4 mr-2'/>
        <span>Tambah</span>
    </Button>
  </SheetTrigger>
  <SheetContent className='p-0'>
    <SheetHeader className='p-4 pb-0'>
      <SheetTitle>Tambah Riwayat Pendidikan</SheetTitle>
      <SheetDescription>
        Data harus di isi dengan lengkap
      </SheetDescription>
    </SheetHeader>

    <CreateEducationHistoryForm/>
  </SheetContent>
</Sheet>

  )
}
