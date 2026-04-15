'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const MASTER_PASSWORD = 'rkcm2024'

export default function MasterPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [riders, setRiders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === MASTER_PASSWORD) {
      setLoggedIn(true)
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const fetchData = async () => {
    const { data: riderData } = await supabase.from('riders').select('*').order('created_at')
    const { data: driverData } = await supabase.from('drivers').select('*').order('created_at')
    const { data: assignmentData } = await supabase.from('assignments').select('*, riders(name, drop_point), drivers(name, home_point, max_passengers)')
    setRiders(riderData || [])
    setDrivers(driverData || [])
    setAssignments(assignmentData || [])
  }

  useEffect(() => {
    if (loggedIn) fetchData()
  }, [loggedIn])

  const assignRider = async (riderId, driverId) => {
    setLoading(true)
    const existing = assignments.find(a => a.rider_id === riderId)
    if (existing) {
      await supabase.from('assignments').delete().eq('rider_id', riderId)
    }
    if (driverId !== '') {
      await supabase.from('assignments').insert([{ rider_id: riderId, driver_id: driverId }])
    }
    await fetchData()
    setLoading(false)
  }

  const handleReset = async () => {
    const confirm = window.confirm('정말 전체 초기화할까요? 라이더, 드라이버, 배정 데이터가 모두 삭제됩니다.')
    if (!confirm) return
    setLoading(true)
    await supabase.from('assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('riders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('drivers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await fetchData()
    setLoading(false)
    alert('초기화 완료!')
  }

  const getAssignedDriver = (riderId) => {
    const a = assignments.find(a => a.rider_id === riderId)
    return a ? a.driver_id : ''
  }

  const getDriverPassengerCount = (driverId) => {
    return assignments.filter(a => a.driver_id === driverId).length
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">마스터 로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
              로그인
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">마스터 대시보드</h1>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
          >
            전체 초기화
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{riders.length}</div>
            <div className="text-gray-500 mt-1">총 라이더</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{drivers.length}</div>
            <div className="text-gray-500 mt-1">총 드라이버</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">라이더 배정</h2>
          {loading && <p className="text-gray-400 text-sm mb-2">저장 중...</p>}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left py-2">이름</th>
                <th className="text-left py-2">드롭 지점</th>
                <th className="text-left py-2">배정 드라이버</th>
              </tr>
            </thead>
            <tbody>
              {riders.map(rider => (
                <tr key={rider.id} className="border-b">
                  <td className="py-2">{rider.name}</td>
                  <td className="py-2">{rider.drop_point}</td>
                  <td className="py-2">
                    <select
                      value={getAssignedDriver(rider.id)}
                      onChange={(e) => assignRider(rider.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">미배정</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({getDriverPassengerCount(driver.id)}/{driver.max_passengers}명)
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}