'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

function HomeContent() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const submitted = searchParams.get('submitted')

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from('assignments')
      .select('*, riders(name, drop_point), drivers(name, home_point)')
    setAssignments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAssignments()

    const channel = supabase
      .channel('assignments-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        fetchAssignments()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const drivers = [...new Map(assignments.map((a: any) => [a.driver_id, a.drivers])).values()]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">

        {submitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {submitted === 'rider' ? '🙋 라이더 신청이 완료됐습니다!' : '🚗 드라이버 신청이 완료됐습니다!'}
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">RKCM Ride</h1>
          <p className="text-gray-500 mb-6">신청 유형을 선택하세요</p>
          <div className="space-y-3">
            <Link href="/rider">
              <div className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-700 cursor-pointer">
                🙋 라이더 / Rider 신청
              </div>
            </Link>
            <Link href="/driver">
              <div className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-green-700 cursor-pointer mt-3">
                🚗 드라이버 / Driver 신청
              </div>
            </Link>
          </div>
        </div>

        {!loading && assignments.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-bold mb-4">🗓 배정 현황 / Status</h2>
            {drivers.map((driver: any) => (
              <div key={driver.name} className="mb-4">
                <div className="font-medium text-gray-700 mb-2">
                  🚗 {driver.name} ({driver.home_point})
                </div>
                <div className="space-y-1 pl-4">
                  {assignments
                    .filter((a: any) => a.drivers.name === driver.name)
                    .map((a: any) => (
                      <div key={a.id} className="text-sm text-gray-600 flex justify-between">
                        <span>🙋 {a.riders.name}</span>
                        <span className="text-gray-400">{a.riders.drop_point}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && assignments.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
            아직 배정된 라이더가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}