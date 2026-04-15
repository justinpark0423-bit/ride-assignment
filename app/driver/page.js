'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function DriverPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [homePoint, setHomePoint] = useState('')
  const [maxPassengers, setMaxPassengers] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('drivers')
      .insert([{ name, phone: '', home_point: homePoint, max_passengers: parseInt(maxPassengers) }])

    if (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
      console.error(error)
      setLoading(false)
    } else {
      router.push('/?submitted=driver')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">드라이버 신청</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">거주 지점</label>
            <select
              value={homePoint}
              onChange={(e) => setHomePoint(e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최대 탑승 인원</label>
            <input
              type="number"
              value={maxPassengers}
              onChange={(e) => setMaxPassengers(e.target.value)}
              required
              min="1"
              max="10"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="탑승 가능 인원을 입력하세요"
            />
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