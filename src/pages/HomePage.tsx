
import React, { useState } from "react"
import { Cpu, Users, Shield, Check, MapPin, Phone, Clock, Edit, Eye, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Homepage() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async () => {
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.access_token) {
        setMessage("Đăng nhập thành công!")
      } else {
        setMessage("Đăng nhập thất bại!")
      }
    } catch (error) {
      setMessage("Lỗi kết nối!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="https://sachso-preview.vercel.app/static/media/sachso_logo.ea7f2393.png" 
                className="h-8 w-auto"
              />
            </a>
            <nav className="flex items-center gap-6">
              <a href="#" style={{ color: '#1179EF' }} className="text-sm relative top-[5px] hover:text-blue-600 font-medium">Trang chủ</a>
              <a href="#" style={{ color: '#1179EF' }} className="text-sm relative top-[5px] hover:text-blue-600 font-medium">Phương nam</a>
              <button onClick={() => setShowLogin(!showLogin)} style={{ color: '#1179EF' }} className="text-sm relative top-[5px] hover:text-blue-600 font-medium">Đăng nhập</button>
              <a href="#" style={{ color: '#1179EF' }} className="text-sm relative top-[5px] hover:text-blue-600 font-medium">Đăng ký học sinh</a>
            </nav>
          </div>
        </div>
      </header>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg flex w-full max-w-3xl overflow-hidden relative">
            {/* Nút đóng */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
              onClick={() => setShowLogin(false)}
            >
              &times;
            </button>
            {/* Cột trái: Form */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8 text-[#23235F]">ĐĂNG NHẬP</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-3 mb-5 border rounded text-lg"
              />
              <div className="relative mb-5">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-5 py-3 border rounded pr-10 text-lg"
                />
              </div>
              <a href="#" className="text-blue-600 text-base mb-5 block">Quên mật khẩu?</a>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3" onClick={handleLogin}>
                ĐĂNG NHẬP
              </Button>
              {message && <p className="mt-6 text-center text-base text-red-500">{message}</p>}
            </div>
            {/* Cột phải: Ảnh minh họa */}
            <div className="hidden md:flex w-1/2 bg-[#1179EF] items-center justify-center">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAIcCAMAAADv+wjAAAAAAXNSR0IB2cksfwAAAv1QTFRFAAAAAHr/////q9D42u73/6sa6Ojo/1w5+Pj48/PzLs52/8RexN/oAG3/AHv/AG7mYq3zzUksgL3/Qz9wv2Nrwb6d7KWYWteXy7MwY7JnK5D+/f3+BgBC/9WNY9uZ/8BU3u/34/L57M3J/66c7Pb89fr+1ej84O/+6PT7IIv+8fj9DoH/+fv8BX3/C5Dcgn+g/7ErL5L+F4b+7+/z0eT4c7X9NC9lwd79y+P9oZ+4/6wdFRBNsNP4geCx7e3t0M/bmsf3/8JZ2er8/79OJSBZqs/4/7Qz8PDwNpX9QZz+YKv+4OHovNv8t9f60Ob99b+0EH70UKT+j8X/hb/9Ppn+bLH8/7k/SZ/+AHf/wL/P/rY5o8z4Zq78pM//Waj9/bpFnMv//64jr9X/Bw1Vc3CUfLj45+vrkpCsrubWU6X5U098QI3YAHb47vX38L9nsa7C89TLfbv/jMH6AHDtwJ5SY5a/t9Hrn6iaQHTNpsztj6Kjv7GESZ32Akau0uvycJu4T5HM52BJ/fPkHBpTBQVKx+Tq2ePrAyqE9qcgjb70f5+vw934AWXdJsCM3rlxieC3AzqcBBts2qY5vn8jYV6H/2VEIIPoMIjgy+L4pmZ9Y2CJ9l1AFnzsAVvOBoDzU9WR6KYvFJ/C0Ioh8rZKQyo3AlC9tufeGqqvBBRhbK3ya2iPf96tz7Z8K8h/ioqiglUucWynAHj/1mRTH7SgAHn/2dng/8xyTHHE+MrB6tXUt2RxRIfBMITTPM14AHT//9mZ/9B+b04yJBU9gpeJimmUN3PUrb2znOPHMyA5r6yQEQlEXEE1cd2mAHn/AHn/pdzixFEx/3daz7BsJHbj/pV/AHn/mpd1AHn+c5Sg+OG0zmFf9t7agsjmAHn/AHj/rKR+HWDBtcXF/6OQMk2UkdPekWArx6NHX4ypW7Vp2K9e0YZ3r2E557hehoSgToOtAHr/KLRvkXpHQ2etg7PUlb1Iv2RqPzptUJLLiZSESsC1IiZjUcqDAHr/zPPdsIZP3fIZGQAAAP90Uk5TAP///////////////xwb/////////////////////////////////////////////////////////////////////////////////////////////////yD//////////////////////////v//////////////////////////////////////////////////////////////////////////////////////////XP//DP///////////xn//////////////////83w////////dP/i//////+aov////////////////////+I////////////////uP//gkFrDQAAIVBJREFUeJztnXmcHFWdwFOV9JiDXYRxdTddayY6k7mdy0wyM9lM5mDIOeaOGUlCJhckEAgYYhIgIYEoASPXyiUiiCiHsiCHiiIei7frut6ut6vrse59H5+t6qrqru6u7nrv937v9a+q3/cPMhm663jf1Hvv93tHTXmjoak4l3zlh08+PcVFCyHCt5/UQojxAy2EGD/QQojxTS2EFt9+WguhxZNaCC3+RwuhxVe1EGI8PeX3Kn0JmiAvaCG0+H0thBZaCDG0EGJoIcTQQoihhRBDCyGGFkIMLYQYWggxtBBiaCHE0EKIoYUQQwshhhZCDC2EGFoIMbQQYmghxNBCiKGFEEMLIYYWQgwthBhaCDG0EGJoIcTQQoihhRBDCyGGFkIMLYQYWggxtBBiaCHE0EKIoYUQQwshhhZCDC2EGFoIMbQQYmghxNBCiKGFEEMLIYYWQgwthBhaCDG0EGJoIcTQQoihhRBDCyGGFkIMLYQYWggxtBBiaCHE0EKIoYUQQwshhhZCDC2EGFUhpHsN80fXL5+/fr3ES4mkKoRsSS9l+2BXo5lh/EDFpFSDkC7TvLSZ6ZOeD4fGA2xfwaYahCy0y/fabpZPmnksWCb7ykKoAiFbM6V7UzvDRxeYFVeSfCHtbj3UdpjByHKzkAVd8q8wj+QLOeAV7YwbGT48XmTEXNsq/RKDJF5Ic5tfsosfYfh0S0DFo198xvmjRWm9lXghk9nybVtxdfTH1wSE9FonVyh/SJIuZFOggGesmB39hUAzstmyat2fxtV1gRMupH042BwsPsXQ+Q0Y6bOsR92f1FVbCReS321qq7mKoau1LNeO3GFZO70fl8u/2AzJFtLemCfEnFGzhMFIc7av1bbXsi5TayTZQg6YBZxfs4vha61r/c+39FpfHPR+Zs9QipBoId0NhULSNTUXs3wzW231jFon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"
                alt="Login Illustration"
                className="w-4/5 h-auto"
                style={{ minHeight: '100%', minWidth: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
<section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 relative overflow-hidden">
  <div className="w-full max-w-full md:max-w-[65%] mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Hình ảnh */}
      <div className="relative">
        <img
          src="https://sachso-preview.vercel.app/static/media/Banner.9161fe34.png"
          alt="Học tập cùng gia đình"
        />
      </div>

      {/* Phần chữ */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-medium mb-6 leading-tight" style={{ color: '#1179EF' }}>
          HỌC TIẾNG ANH HIỆU QUẢ
        </h1>
        <p className="text-justify text-lg mb-6">
          Áp dụng phương pháp học tập khoa học mới hệ thống học trực tuyến thông minh, ứng dụng công nghệ 4.0 với trí tuệ nhân tạo...
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">Bắt đầu ngay</Button>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Tìm hiểu thêm</Button>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Features Section */}
<section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 relative overflow-hidden">
  <div className="w-full max-w-full md:max-w-[65%] mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">TÍNH NĂNG NỔI BẬT</h2>
    <div className="grid md:grid-cols-3 gap-8 justify-center">
      
      {/* Box 1 */}
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col max-w-sm mx-auto">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 text-center mb-2">CHẤM ĐIỂM AI TỰ ĐỘNG</h3>
        <p className="text-gray-600 text-sm text-justify">
          Việc tích hợp hệ thống AI chấm điểm giúp hạn chế việc lấy đi một khoảng thời gian đáng kể...
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition">CÁC BÀI TRẮC NGHIỆM</button>
          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-4 py-2 rounded-md transition">LUYỆN TẬP VỚI AI</button>
        </div>
      </div>

      {/* Box 2 */}
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col max-w-sm mx-auto">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-orange-600 text-center mb-2">GIÁO VIÊN QUẢN LÝ HỌC SINH</h3>
        <p className="text-gray-600 text-sm text-justify">
          Xây dựng hệ thống quản lý lớp học từ xa. Là nơi giáo viên có thể chủ động theo dõi việc học và làm bài của học sinh...
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition">QUẢN LÝ LỚP</button>
          <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs px-4 py-2 rounded-md transition">ĐÁNH GIÁ KẾT QUẢ HỌC TẬP</button>
        </div>
      </div>

      {/* Box 3 */}
      <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex flex-col max-w-sm mx-auto">
        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-purple-600 text-center mb-2">PHỤ HUYNH THEO DÕI HỌC SINH</h3>
        <p className="text-gray-600 text-sm text-justify">
          Nhu cầu theo dõi việc học tập của con cái đối với phụ huynh là một nhu cầu hàng đầu...
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition">THEO DÕI KẾT QUẢ HỌC TẬP</button>
        </div>
      </div>

    </div>
  </div>
</section>

{/* Pyramid Section */}
<section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 relative overflow-hidden">
  <div className="w-full max-w-full md:max-w-[65%] mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-stretch">
      
      {/* Cột trái - ảnh */}
      <div className="order-last lg:order-first">
        <img
          src="https://sachso-preview.vercel.app/static/media/Piramid.3db44542.png"
          alt="Tháp học tập"
          className="w-full max-w-3xl mx-auto"
        />
      </div>

      {/* Cột phải - nội dung tím */}
      <div className="bg-indigo-500 rounded-lg p-6 text-white shadow-lg h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-4">
          Phương pháp học Tiếng Anh dựa theo "Tháp học tập"
        </h3>
        <ul className="space-y-4 ml-1">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-[2px] text-green-300" />
            <p className="text-sm">
              Hệ thống bài học được thiết kế công phu, khoa học và hấp dẫn...
            </p>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-[2px] text-green-300" />
            <p className="text-sm">
              Giúp học viên ghi nhớ lâu những kiến thức được học thông qua trải nghiệm trực tiếp...
            </p>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-[2px] text-green-300" />
            <p className="text-sm">
              Ứng dụng hình ảnh, âm thanh, hành động và cảm xúc vào việc học từ vựng...
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
  <div className="w-full max-w-full md:max-w-[65%] mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      
      {/* Logo và thông tin liên hệ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">GD</span>
          </div>
          <div>
            <h4 className="font-bold text-green-600">NXBGD VIETNAM</h4>
            <p className="text-sm text-gray-600">CTCP ĐẦU TƯ & PT GD PHƯƠNG NAM</p>
          </div>
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 231 Nguyễn Văn Cừ - P.4 - Q.5 - TP.HCM</div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> (028) 73 035 556</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8h00 - 17h00</div>
        </div>
      </div>

      {/* Logo Sách Số và bản quyền */}
      <div className="text-center md:text-right">
        <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
          <img 
            src="https://sachso-preview.vercel.app/static/media/sachso_logo.ea7f2393.png" 
            className="h-6 w-auto"
          />
        </div>
        <p className="text-sm text-gray-500">© 2025 Sách Số</p>
      </div>
    </div>
  </div>
</footer>

    </div>
  )
}