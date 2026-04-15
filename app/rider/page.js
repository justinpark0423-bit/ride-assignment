'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RiderPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dropPoint, setDropPoint] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('riders')
      .insert([{ name, phone, drop_point: dropPoint }])

    if (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
      console.error(error)
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">신청 완료!</h2>
          <p className="text-gray-600">라이더 신청이 접수되었습니다.</p>
          <p className="text-gray-500 mt-2">이름: {name}</p>
          <p className="text-gray-500">드롭 지점: {dropPoint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">라이더 신청</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="전화번호를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">드롭 지점</label>
            <select
              value={dropPoint}
              onChange={(e) => setDropPoint(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">지점을 선택하세요</option>
              <option value="Livi">Livi</option>
              <option value="Busch">Busch</option>
              <option value="CA">CA</option>
              <option value="C/D">C/D</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '제출 중...' : '신청하기'}
          </button>
        </form>
      </div>
    </div>
  )
}