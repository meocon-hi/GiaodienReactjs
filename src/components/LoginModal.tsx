import React, { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "./ui/button"

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [showPwd, setShowPwd] = useState(false)

  if (!open) return null      // ẩn modal khi không mở

  return (
    // 👉 Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 👉 Khung modal */}
      <div className="relative bg-white w-full max-w-3xl rounded-md overflow-hidden shadow-xl">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2">
          {/* Cột form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">ĐĂNG NHẬP</h2>

            {/* Email */}
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* Password */}
            <label className="block text-sm mb-1">Mật khẩu</label>
            <div className="relative mb-4">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <a href="#" className="text-sm text-blue-600 hover:underline inline-block mb-6">
              Quên mật khẩu?
            </a>

            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              ĐĂNG NHẬP
            </Button>
          </div>

          {/* Cột ảnh minh hoạ */}
          <div className="hidden lg:block bg-[#0177ff]">
            <img
              src="https://sachso-preview.vercel.app/static/media/LoginIllustration.abc123.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
