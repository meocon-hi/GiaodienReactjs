import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface User {
  id?: string
  name: string
  email: string
  type: string
  level: string
  date?: string
}

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  onSubmit: (user: User) => void
  mode: "add" | "edit"
}

export default function UserFormModal({ isOpen, onClose, user, onSubmit, mode }: UserFormModalProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    type: "Học sinh",
    level: "Cấp 1"
  })

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData(user)
    } else {
      setFormData({
        name: "",
        email: "",
        type: "Học sinh",
        level: "Cấp 1"
      })
    }
  }, [user, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Loại tài khoản</label>
            <Select 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Học sinh">Học sinh</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Admin">Admin</option>
              <option value="Phụ huynh">Phụ huynh</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cấp</label>
            <Select 
              value={formData.level} 
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option value="Cấp 1">Cấp 1</option>
              <option value="Cấp 2">Cấp 2</option>
              <option value="Cấp 3">Cấp 3</option>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              {mode === "add" ? "Thêm" : "Cập nhật"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 