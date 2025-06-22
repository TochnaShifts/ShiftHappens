'use client'

import { Label } from '@/app/components/loveable/label'
import { Checkbox } from '@/app/components/loveable/checkbox'

interface Item {
  id: string
  label: string
}

interface Props {
  label: string
  selected: string[]
  options: Item[]
  onChange: (updated: string[]) => void
  error?: string
}

export const CheckboxGroup = ({ label, selected, options, onChange, error }: Props) => {
  const toggle = (id: string, checked: boolean) => {
    const updated = checked ? [...selected, id] : selected.filter((v) => v !== id)
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="p-3 border bg-gray-50 rounded-md space-y-2">
        {options.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id={`checkbox-${item.id}`}
              checked={selected.includes(item.id)}
              onCheckedChange={(val) => toggle(item.id, val as boolean)}
            />
            <Label htmlFor={`checkbox-${item.id}`}>{item.label}</Label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
