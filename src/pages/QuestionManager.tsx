import { useState } from 'react';
import {
  Table as AntTable,
  Button as AntButton,
  Modal,
  Form,
  Input as AntInput,
  Select as AntSelect,
  Space
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

interface Question {
  id: number;
  grade: string;
  unit: string;
  skill: string;
  content: string;
  type: string;
  level: string;
  requirement: string; // Thêm trường yêu cầu đề bài
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // Lọc
  const [filters, setFilters] = useState({
    grade: '',
    unit: '',
    skill: '',
    type: '',
    level: '',
    keyword: '',
    requirement: '' // Thêm trường yêu cầu đề bài
  });

  const handleFilter = () => {
    setFilters({ ...filters }); // Để trigger filter, thực tế đã filter theo state
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingQuestion) {
        setQuestions(qs =>
          qs.map(q => (q.id === editingQuestion.id ? { ...editingQuestion, ...values } : q))
        );
      } else {
        setQuestions(qs => [...qs, { ...values, id: Date.now() }]);
      }
      setShowModal(false);
      setEditingQuestion(null);
      form.resetFields();
    });
  };

  const handleEdit = (q: Question) => {
    setEditingQuestion(q);
    setShowModal(true);
    form.setFieldsValue(q);
  };

  const handleDelete = (id: number) => {
    setQuestions(qs => qs.filter(q => q.id !== id));
  };

  const handleCreate = () => {
    createForm.validateFields().then(values => {
      setQuestions(qs => [...qs, { ...values, id: Date.now() }]);
      createForm.resetFields();
    });
  };

  // Lọc thêm theo requirement nếu có
  const filteredQuestions = questions.filter(q =>
    (!filters.grade || q.grade === filters.grade) &&
    (!filters.unit || q.unit === filters.unit) &&
    (!filters.skill || q.skill === filters.skill) &&
    (!filters.type || q.type === filters.type) &&
    (!filters.level || q.level === filters.level) &&
    (!filters.keyword || q.content.toLowerCase().includes(filters.keyword.toLowerCase())) &&
    (!filters.requirement || (q.requirement === filters.requirement))
  );

  const columns = [
    { title: 'Khối lớp', dataIndex: 'grade', key: 'grade' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
    { title: 'Kỹ năng', dataIndex: 'skill', key: 'skill' },
    {
      title: 'Câu hỏi',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <MathJaxContext>
          <MathJax inline dynamic>{text}</MathJax>
        </MathJaxContext>
      )
    },
    { title: 'Loại câu hỏi', dataIndex: 'type', key: 'type' },
    { title: 'Mức độ nhận thức', dataIndex: 'level', key: 'level' },
    { title: 'Yêu cầu đề bài', dataIndex: 'requirement', key: 'requirement' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Question) => (
        <Space>
          <AntButton icon={<EyeOutlined />} />
          <AntButton icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <AntButton icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">QUẢN LÝ CÂU HỎI</h2>
          <AntButton type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
            Tạo câu hỏi
          </AntButton>
        </div>

        {/* FORM TẠO CÂU HỎI MỚI */}
        <div className="mb-6">
          <Form layout="inline" form={createForm} onFinish={handleCreate}>
            <Form.Item name="grade" rules={[{ required: true, message: 'Chọn khối lớp' }]}>
              <AntSelect placeholder="Khối lớp" style={{ width: 100 }}>
                <AntSelect.Option value="Lớp 1">Lớp 1</AntSelect.Option>
                <AntSelect.Option value="Lớp 2">Lớp 2</AntSelect.Option>
                <AntSelect.Option value="Lớp 3">Lớp 3</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="unit" rules={[{ required: true, message: 'Chọn Unit' }]}>
              <AntSelect placeholder="Unit" style={{ width: 120 }}>
                <AntSelect.Option value="Unit 1">Unit 1</AntSelect.Option>
                <AntSelect.Option value="Unit 2">Unit 2</AntSelect.Option>
                <AntSelect.Option value="Unit Starter">Unit Starter</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="skill" rules={[{ required: true, message: 'Nhập kỹ năng' }]}>
              <AntInput placeholder="Kỹ năng" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="content" rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}>
              <AntInput placeholder="Câu hỏi" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="type" rules={[{ required: true, message: 'Nhập loại câu hỏi' }]}>
              <AntInput placeholder="Loại" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="level" rules={[{ required: true, message: 'Chọn mức độ' }]}>
              <AntSelect placeholder="Mức độ" style={{ width: 120 }}>
                <AntSelect.Option value="Nhận biết">Nhận biết</AntSelect.Option>
                <AntSelect.Option value="Thông hiểu">Thông hiểu</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="requirement" rules={[{ required: true, message: 'Chọn yêu cầu đề bài' }]}>
              <AntSelect placeholder="Yêu cầu đề bài" style={{ width: 130 }}>
                <AntSelect.Option value="Có">Có</AntSelect.Option>
                <AntSelect.Option value="Không">Không</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">Thêm mới</AntButton>
            </Form.Item>
          </Form>
        </div>

        {/* BỘ LỌC */}
        <div className="mb-4">
          <Form layout="inline" onFinish={handleFilter} initialValues={filters}>
            <Form.Item name="grade">
              <AntSelect
                placeholder="Khối lớp"
                allowClear
                style={{ width: 110 }}
                value={filters.grade || undefined}
                onChange={val => setFilters({ ...filters, grade: val || '' })}
              >
                <AntSelect.Option value="">Tất cả</AntSelect.Option>
                <AntSelect.Option value="Lớp 1">Lớp 1</AntSelect.Option>
                <AntSelect.Option value="Lớp 2">Lớp 2</AntSelect.Option>
                <AntSelect.Option value="Lớp 3">Lớp 3</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="unit">
              <AntSelect
                placeholder="Unit"
                allowClear
                style={{ width: 120 }}
                value={filters.unit || undefined}
                onChange={val => setFilters({ ...filters, unit: val || '' })}
              >
                <AntSelect.Option value="">Tất cả</AntSelect.Option>
                <AntSelect.Option value="Unit 1">Unit 1</AntSelect.Option>
                <AntSelect.Option value="Unit 2">Unit 2</AntSelect.Option>
                <AntSelect.Option value="Unit Starter">Unit Starter</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="skill">
              <AntInput
                placeholder="Kỹ năng"
                style={{ width: 120 }}
                value={filters.skill}
                onChange={e => setFilters({ ...filters, skill: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="type">
              <AntInput
                placeholder="Dạng câu hỏi"
                style={{ width: 120 }}
                value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="requirement">
              <AntSelect
                placeholder="Yêu cầu đề bài"
                allowClear
                style={{ width: 130 }}
                value={filters.requirement || undefined}
                onChange={val => setFilters({ ...filters, requirement: val || '' })}
              >
                <AntSelect.Option value="">Tất cả</AntSelect.Option>
                <AntSelect.Option value="Có">Có</AntSelect.Option>
                <AntSelect.Option value="Không">Không</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="level">
              <AntSelect
                placeholder="Mức độ nhận thức"
                allowClear
                style={{ width: 140 }}
                value={filters.level || undefined}
                onChange={val => setFilters({ ...filters, level: val || '' })}
              >
                <AntSelect.Option value="">Tất cả</AntSelect.Option>
                <AntSelect.Option value="Nhận biết">Nhận biết</AntSelect.Option>
                <AntSelect.Option value="Thông hiểu">Thông hiểu</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="keyword">
              <AntInput
                placeholder="Câu hỏi"
                style={{ width: 160 }}
                value={filters.keyword}
                onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              />
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">Tìm kiếm</AntButton>
            </Form.Item>
          </Form>
        </div>

        <AntTable columns={columns} dataSource={filteredQuestions} rowKey="id" pagination={{ pageSize: 10 }} />

        {/* MODAL */}
        <Modal
          title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
          open={showModal}
          onCancel={() => { setShowModal(false); setEditingQuestion(null); }}
          onOk={handleSubmit}
          okText={editingQuestion ? 'Cập nhật' : 'Thêm'}
        >
          <Form layout="vertical" form={form}>
            <Form.Item name="grade" label="Khối lớp" rules={[{ required: true }]}>
              <AntSelect>
                <AntSelect.Option value="Lớp 1">Lớp 1</AntSelect.Option>
                <AntSelect.Option value="Lớp 2">Lớp 2</AntSelect.Option>
                <AntSelect.Option value="Lớp 3">Lớp 3</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <AntSelect>
                <AntSelect.Option value="Unit 1">Unit 1</AntSelect.Option>
                <AntSelect.Option value="Unit 2">Unit 2</AntSelect.Option>
                <AntSelect.Option value="Unit Starter">Unit Starter</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="skill" label="Kỹ năng" rules={[{ required: true }]}>
              <AntInput />
            </Form.Item>
            <Form.Item name="content" label="Câu hỏi" rules={[{ required: true }]}>
              <AntInput.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}>
              <AntInput />
            </Form.Item>
            <Form.Item name="level" label="Mức độ nhận thức" rules={[{ required: true }]}>
              <AntSelect>
                <AntSelect.Option value="Nhận biết">Nhận biết</AntSelect.Option>
                <AntSelect.Option value="Thông hiểu">Thông hiểu</AntSelect.Option>
              </AntSelect>
            </Form.Item>
            <Form.Item name="requirement" label="Yêu cầu đề bài" rules={[{ required: true }]}>
              <AntSelect>
                <AntSelect.Option value="Có">Có</AntSelect.Option>
                <AntSelect.Option value="Không">Không</AntSelect.Option>
              </AntSelect>
            </Form.Item>
          </Form>
          <div className="mt-4">
            <div className="font-semibold mb-1">Xem trước công thức toán học:</div>
            <MathJaxContext>
              <MathJax dynamic>{form.getFieldValue('content') || ''}</MathJax>
            </MathJaxContext>
          </div>
        </Modal>
      </div>
    </div>
  );
}
