
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import {
  Home,
  Bell,
  BookOpen,
  Settings,
  Users,
  GraduationCap,
  Gamepad2,
  Target,
  UserPlus,
  FileSpreadsheet,
  Search,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import * as XLSX from "xlsx";
// import UserFormModal from "./user-form-modal"
// 1. Thêm import cho Ant Design và mathjax-react
import { Table as AntTable, Button as AntButton, Modal, Form, Input as AntInput, Select as AntSelect } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import QuestionManager from './QuestionManager';

interface ApiUser {
  id: number
  email: string
  password: string
  name: string
  role: string
  creationAt: string
}

interface User {
  id: string
  name: string
  type: string
  level: string
  email: string
  phone: string
  date: string
}

interface SidebarItem {
  icon: any
  label: string
  active: boolean
}

interface AdminItem {
  icon: any
  label: string
  active: boolean
}

interface TitleItem {
  label: string
  isTitle: boolean
}

// Thêm interface cho user mới
interface NewUser {
  name: string
  email: string
  password: string
  avatar: string
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Trang chủ", active: false },
  { icon: Bell, label: "Thông báo", active: false },
  { icon: BookOpen, label: "Sách điện tử (offline)", active: false },
  { icon: Settings, label: "Công cụ", active: false },
  { icon: BookOpen, label: "Sách điện tử", active: false },
  { icon: GraduationCap, label: "Lớp học", active: false },
  { icon: Gamepad2, label: "Education Game", active: false },
  { icon: Target, label: "Hướng dẫn sử dụng", active: false },
]

const adminItems: AdminItem[] = [
  { icon: Users, label: "Thư viện", active: false },
  { icon: Settings, label: "Quản lý câu hỏi", active: false },
  { icon: GraduationCap, label: "Quản lý lớp học", active: false },
  { icon: Target, label: "Ngân hàng đề kiểm tra", active: false },
  { icon: Users, label: "Quản lý người dùng", active: true },
  { icon: Settings, label: "Type & OptionType", active: false },
]

// Hàm tạo số điện thoại random
const generateRandomPhone = (): string => {
  const prefixes = ['032', '033', '034', '035', '036', '037', '038', '039', '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '086', '088', '089', '090', '091', '092', '093', '094', '096', '097', '098']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  return `${prefix}${suffix}`
}

// Hàm chuyển đổi role từ API thành type cho UI
const mapRoleToType = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'customer':
      return 'Học sinh'
    case 'seller':
      return 'Giáo viên'
    default:
      return 'Học sinh'
  }
}

// Hàm chuyển đổi ngày tháng
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", type: "Học sinh", level: "Cấp 1" })
  const [userData, setUserData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  // Bộ lọc
  const [filterType, setFilterType] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterEmail, setFilterEmail] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  // Modal thêm user
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    avatar: 'https://picsum.photos/800'
  })
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  // Modal cập nhật user
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{success: number, fail: number}>({success: 0, fail: 0});

  // 2. Thêm state để chuyển tab admin (user/question)
  const [adminTab, setAdminTab] = useState<'user' | 'question'>('user');

  // 5. Thêm state và logic cho quản lý câu hỏi Multiple Choice
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm] = Form.useForm();
  // Sửa lại columns cho bảng câu hỏi
  const questionColumns = [
    { title: 'Nội dung', dataIndex: 'content', key: 'content', render: (text: string) => (
      <MathJaxContext>
        <MathJax inline dynamic>{text}</MathJax>
      </MathJaxContext>
    ) },
    { title: 'A', dataIndex: 'A', key: 'A' },
    { title: 'B', dataIndex: 'B', key: 'B' },
    { title: 'C', dataIndex: 'C', key: 'C' },
    { title: 'D', dataIndex: 'D', key: 'D' },
    { title: 'Đáp án đúng', dataIndex: 'correct', key: 'correct' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <AntButton icon={<EditOutlined />} onClick={() => handleEditQuestion(record)} style={{ marginRight: 8 }} />
          <AntButton icon={<DeleteOutlined />} danger onClick={() => handleDeleteQuestion(record.id)} />
        </>
      )
    }
  ];

  // Helper function để lấy giá trị cột với tên đã được trim
  const getColumnValue = (row: any, columnName: string): string => {
    const trimmedName = columnName.trim();
    // Thử tìm với tên gốc trước
    if (row[columnName] !== undefined) return row[columnName];
    // Nếu không có, thử với tên đã trim
    if (row[trimmedName] !== undefined) return row[trimmedName];
    // Thử các biến thể có khoảng trắng
    const variations = [columnName, trimmedName, trimmedName + ' ', trimmedName + '  ', trimmedName + '    '];
    for (const variation of variations) {
      if (row[variation] !== undefined) return row[variation];
    }
    return '';
  };

  // Fetch data từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.escuelajs.co/api/v1/users')
        const apiUsers: ApiUser[] = await response.json()
        
        // Chuyển đổi dữ liệu từ API thành format UI
        const convertedUsers: User[] = apiUsers.map(apiUser => ({
          id: apiUser.id.toString(),
          name: apiUser.name,
          type: mapRoleToType(apiUser.role),
          level: `Cấp ${Math.floor(Math.random() * 3) + 1}`, // Random level
          email: apiUser.email,
          phone: generateRandomPhone(),
          date: formatDate(apiUser.creationAt)
        }))
        
        setUserData(convertedUsers)
        setFilteredUsers(convertedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Hàm tìm kiếm
  const handleSearch = async () => {
    setSearching(true)
    let result: User[] = userData
    // Nếu nhập số vào email, thử tìm theo id qua API
    if (filterEmail && /^\d+$/.test(filterEmail.trim())) {
      try {
        setLoading(true)
        const res = await fetch(`https://api.escuelajs.co/api/v1/users/${filterEmail.trim()}`)
        if (res.ok) {
          const apiUser: ApiUser = await res.json()
          result = [{
            id: apiUser.id.toString(),
            name: apiUser.name,
            type: mapRoleToType(apiUser.role),
            level: `Cấp ${Math.floor(Math.random() * 3) + 1}`,
            email: apiUser.email,
            phone: generateRandomPhone(),
            date: formatDate(apiUser.creationAt)
          }]
        } else {
          result = []
        }
      } catch {
        result = []
      } finally {
        setLoading(false)
      }
    } else {
      // Lọc local
      if (filterType !== 'all') {
        result = result.filter(u => u.type === filterType)
      }
      if (filterLevel !== 'all') {
        result = result.filter(u => u.level === filterLevel)
      }
      if (filterEmail.trim()) {
        result = result.filter(u => u.email.toLowerCase().includes(filterEmail.trim().toLowerCase()))
      }
    }
    setFilteredUsers(result)
    setCurrentPage(1)
    setSearching(false)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", type: "Học sinh", level: "Cấp 1" })
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, type: user.type, level: user.level })
    setIsModalOpen(true)
  }

  const handleSubmit = (user: User) => {
    console.log("Form submitted:", user)
    setIsModalOpen(false)
  }

  // Hàm thêm user mới
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    setAddSuccess('')
    try {
      const res = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (res.ok) {
        const apiUser: ApiUser = await res.json()
        // Thêm vào danh sách local
        const addedUser: User = {
          id: apiUser.id.toString(),
          name: apiUser.name,
          type: mapRoleToType(apiUser.role),
          level: `Cấp ${Math.floor(Math.random() * 3) + 1}`,
          email: apiUser.email,
          phone: generateRandomPhone(),
          date: formatDate(apiUser.creationAt)
        }
        setUserData(prev => [addedUser, ...prev])
        setFilteredUsers(prev => [addedUser, ...prev])
        setAddSuccess('Thêm người dùng thành công!')
        setShowAddModal(false)
        setNewUser({ name: '', email: '', password: '', avatar: 'https://picsum.photos/800' })
      } else {
        setAddError('Thêm người dùng thất bại!')
      }
    } catch (err) {
      setAddError('Có lỗi xảy ra!')
    } finally {
      setAdding(false)
    }
  }

  // Hàm mở modal cập nhật user
  const handleOpenEditModal = (user: User) => {
    setEditUser(user)
    setEditForm({ name: user.name, email: user.email })
    setShowEditModal(true)
    setUpdateError('')
    setUpdateSuccess('')
  }

  // Hàm cập nhật user
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setUpdating(true)
    setUpdateError('')
    setUpdateSuccess('')
    try {
      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name, email: editForm.email })
      })
      if (res.ok) {
        const apiUser: ApiUser = await res.json()
        // Cập nhật lại user trong danh sách local
        setUserData(prev => prev.map(u => u.id === editUser.id ? {
          ...u,
          name: apiUser.name,
          email: apiUser.email
        } : u))
        setFilteredUsers(prev => prev.map(u => u.id === editUser.id ? {
          ...u,
          name: apiUser.name,
          email: apiUser.email
        } : u))
        setUpdateSuccess('Cập nhật thành công!')
        setShowEditModal(false)
      } else {
        setUpdateError('Cập nhật thất bại!')
      }
    } catch (err) {
      setUpdateError('Có lỗi xảy ra!')
    } finally {
      setUpdating(false)
    }
  }

  // Hàm mở modal xác nhận xóa
  const handleOpenDeleteModal = (user: User) => {
    setDeletingUser(user)
    setShowDeleteModal(true)
    setDeleteError('')
  }

  // Hàm xóa user
  const handleDeleteUser = async () => {
    if (!deletingUser) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${deletingUser.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setUserData(prev => prev.filter(u => u.id !== deletingUser.id))
        setFilteredUsers(prev => prev.filter(u => u.id !== deletingUser.id))
        setShowDeleteModal(false)
        setDeletingUser(null)
      } else {
        setDeleteError('Xóa thất bại!')
      }
    } catch (err) {
      setDeleteError('Có lỗi xảy ra!')
    } finally {
      setDeleting(false)
    }
  }

  // Hàm xử lý import Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult({success: 0, fail: 0});
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      let success = 0, fail = 0;
      if (rows.length > 0 && rows[0]) {
        console.log('Header các cột:', Object.keys(rows[0] as object));
      } else {
        console.log('Không có dòng nào trong file Excel!');
      }
      for (const row of rows as any[]) {
        // Xử lý tên cột có khoảng trắng thừa
        const user = {
          name: getColumnValue(row, 'name'),
          email: getColumnValue(row, 'email'),
          password: getColumnValue(row, 'password'),
          avatar: getColumnValue(row, 'avatar') || "https://picsum.photos/800"
        };
        if (!user.name || !user.email || !user.password) {
          console.error('Thiếu trường bắt buộc:', user, row);
          fail++;
          continue;
        }
        try {
          console.log('Đang gửi user:', user);
          const res = await fetch("https://api.escuelajs.co/api/v1/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
          });
          if (!res.ok) {
            const errorText = await res.text();
            console.error('Lỗi khi tạo user:', errorText, user);
            fail++;
            continue;
          }
          success++;
          // Thêm vào danh sách local nếu muốn cập nhật ngay
          const apiUser = await res.json();
          const addedUser = {
            id: apiUser.id.toString(),
            name: apiUser.name,
            type: mapRoleToType(apiUser.role),
            level: `Cấp ${Math.floor(Math.random() * 3) + 1}`,
            email: apiUser.email,
            phone: generateRandomPhone(),
            date: formatDate(apiUser.creationAt)
          };
          setUserData(prev => [addedUser, ...prev]);
          setFilteredUsers(prev => [addedUser, ...prev]);
        } catch (err) {
          console.error('Lỗi fetch:', err, user);
          fail++;
        }
      }
      setImportResult({success, fail});
    } catch (err) {
      setImportResult({success: 0, fail: 0});
    }
    setImporting(false);
  };

  // 5. Thêm state và logic cho quản lý câu hỏi Multiple Choice
  function handleQuestionSubmit() {
    questionForm.validateFields().then(values => {
      if (editingQuestion) {
        setQuestions(qs => qs.map(q => q.id === editingQuestion.id ? { ...editingQuestion, ...values } : q));
      } else {
        setQuestions(qs => [...qs, { ...values, id: Date.now() }]);
      }
      setShowAddQuestionModal(false);
      setEditingQuestion(null);
      questionForm.resetFields();
    });
  }
  function handleEditQuestion(q: any) {
    setEditingQuestion(q);
    setShowAddQuestionModal(true);
    questionForm.setFieldsValue(q);
  }
  function handleDeleteQuestion(id: any) {
    setQuestions(qs => qs.filter(q => q.id !== id));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className={`${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg border-r transition-all duration-300 rounded-tr-2xl`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="font-semibold text-gray-800">Sách Số</span>}
          </div>
        </div>
        <nav className="p-2">
          {[...sidebarItems, { label: "ADMINISTRATORS", isTitle: true } as TitleItem, ...adminItems].map((item, i) =>
            'isTitle' in item ? (
              sidebarOpen && <div key={i} className="mt-6 px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</div>
            ) : (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 cursor-pointer hover:bg-blue-50 ${item.active ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                onClick={() => {
                  if (item.label === 'Quản lý người dùng') setAdminTab('user');
                  if (item.label === 'Quản lý câu hỏi') setAdminTab('question');
                }}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </div>
            )
          )}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <span className="text-sm">Test IT ON</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Home className="w-4 h-4" />
            <span>Administration</span>
            <span>{">"}</span>
            <span>Quản lý người dùng</span>
          </div>
        </div>

        <div className="flex-1 p-6">
          {adminTab === 'user' && (
            <div className="bg-white rounded-2xl shadow-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">QUẢN LÝ NGƯỜI DÙNG</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-white rounded-xl shadow">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                  </Button>
                  <label className="rounded-xl shadow cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Nhập từ excel
                    <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} style={{display: "none"}} />
                  </label>
                </div>
              </div>
              {importing && <div className="p-4 text-blue-600">Đang nhập dữ liệu từ Excel...</div>}
              {(importResult.success > 0 || importResult.fail > 0) && (
                <div className="p-4 text-green-700">Thành công: {importResult.success} | Thất bại: <span className="text-red-600">{importResult.fail}</span></div>
              )}

              {/* Modal cập nhật user */}
              {showEditModal && editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowEditModal(false)}>&times;</button>
                    <h2 className="text-xl font-bold mb-4">Cập nhật người dùng</h2>
                    <form onSubmit={handleEditUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tên</label>
                        <Input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                      </div>
                      {updateError && <div className="text-red-500 text-sm">{updateError}</div>}
                      {updateSuccess && <div className="text-green-600 text-sm">{updateSuccess}</div>}
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1 bg-blue-600 text-white" disabled={updating}>
                          <Edit className="w-4 h-4 mr-2" />
                          {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                        <Button type="button" className="flex-1" onClick={() => setShowEditModal(false)}>Hủy</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal thêm user */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowAddModal(false)}>&times;</button>
                    <h2 className="text-xl font-bold mb-4">Thêm người dùng mới</h2>
                    <form onSubmit={handleAddUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tên</label>
                        <Input type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <Input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Avatar (URL)</label>
                        <Input type="text" value={newUser.avatar} onChange={e => setNewUser({ ...newUser, avatar: e.target.value })} />
                      </div>
                      {addError && <div className="text-red-500 text-sm">{addError}</div>}
                      {addSuccess && <div className="text-green-600 text-sm">{addSuccess}</div>}
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1 bg-blue-600 text-white" disabled={adding}>{adding ? 'Đang thêm...' : 'Thêm'}</Button>
                        <Button type="button" className="flex-1" onClick={() => setShowAddModal(false)}>Hủy</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Modal xác nhận xóa */}
              {showDeleteModal && deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowDeleteModal(false)}>&times;</button>
                    <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa</h2>
                    <p className="mb-4">Bạn có chắc muốn xóa người dùng <span className="font-semibold">{deletingUser.name}</span> không?</p>
                    {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleDeleteUser} className="flex-1 bg-red-600 text-white" disabled={deleting}>{deleting ? 'Đang xóa...' : 'Xóa'}</Button>
                      <Button type="button" className="flex-1" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản:</label>
                    <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                      <option value="all">Tất cả</option>
                      <option value="Học sinh">Học sinh</option>
                      <option value="Giáo viên">Giáo viên</option>
                      <option value="Admin">Admin</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cấp:</label>
                    <Select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                      <option value="all">Tất cả</option>
                      <option value="Cấp 1">Cấp 1</option>
                      <option value="Cấp 2">Cấp 2</option>
                      <option value="Cấp 3">Cấp 3</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc ID:</label>
                    <Input value={filterEmail} onChange={e => setFilterEmail(e.target.value)} placeholder="Nhập email hoặc ID..." />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-xl shadow" disabled={searching}>
                      <Search className="w-4 h-4 mr-2" />
                      {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Loại tài khoản</TableHead>
                      <TableHead>Cấp</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user, index) => (
                      <TableRow key={user.id} className="hover:bg-blue-50">
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`rounded-full px-2 text-sm ${user.level === "Cấp 1" ? "border-green-500 text-green-700" : user.level === "Cấp 2" ? "border-orange-500 text-orange-700" : "border-red-500 text-red-700"}`}>{user.level}</Badge>
                        </TableCell>
                        <TableCell className="text-blue-600">{user.email}</TableCell>
                        <TableCell className="text-gray-600">{user.phone}</TableCell>
                        <TableCell className="text-sm text-gray-500">{user.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center" onClick={() => handleOpenEditModal(user)}>
                              <Edit className="w-4 h-4" />✏️
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                              <Eye className="w-4 h-4" />🔍
                            </Button>
                            <Button variant="outline" className="h-8 w-8 p-0 flex items-center justify-center text-red-600 hover:text-red-700" onClick={() => handleOpenDeleteModal(user)}>
                              <Trash2 className="w-4 h-4" />🗑️
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="rounded-lg shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {getPageNumbers().map((num) => (
                    <Button 
                      key={num} 
                      onClick={() => handlePageChange(num)}
                      className={`rounded-lg shadow-sm ${num === currentPage ? "bg-blue-500 text-white" : "hover:bg-blue-50"}`}
                    >
                      {num}
                    </Button>
                  ))}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-sm text-gray-500">...</span>
                      <Button 
                        onClick={() => handlePageChange(totalPages)}
                        className="rounded-lg shadow-sm hover:bg-blue-50"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="rounded-lg shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
                </div>
              </div>
            </div>
          )}

          {adminTab === 'question' && <QuestionManager />}
        </div>
      </div>

      {/* <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={editingUser} 
        onSubmit={handleSubmit} 
        mode={editingUser ? "edit" : "add"}
      /> */}
    </div>
  )
}
