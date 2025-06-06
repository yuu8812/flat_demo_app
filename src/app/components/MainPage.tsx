"use client"
import { trpc } from "@/app/trpc/client"
import { Edit3, Plus, Save, Search, Trash2, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

const MainPage = () => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: "", content: "" })
  const [newMemo, setNewMemo] = useState({ title: "", content: "" })
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data, refetch } = trpc.memo.getAll.useQuery()

  const { mutate: createMemo, isPending: isCreating } = trpc.memo.create.useMutation({
    onSuccess: () => {
      setNewMemo({ title: "", content: "" })
      setShowCreateForm(false)
      refetch()
      toast.success("メモを作成しました")
    }
  })

  const { mutate: deleteMemo, isPending: isDeleting } = trpc.memo.delete.useMutation({
    onSuccess: () => {
      refetch()
      toast.success("メモを削除しました")
    }
  })

  const { mutate: updateMemo, isPending: isUpdating } = trpc.memo.update.useMutation({
    onSuccess: () => {
      setEditingId(null)
      setEditForm({ title: "", content: "" })
      refetch()
      toast.success("メモを更新しました")
    }
  })

  const handleCreate = () => {
    if (!newMemo.title.trim()) return
    createMemo({
      title: newMemo.title,
      content: newMemo.content
    })
  }

  const handleEdit = (memo: { id: string; title: string; content: string }) => {
    setEditingId(memo.id)
    setEditForm({ title: memo.title, content: memo.content })
  }

  const handleUpdate = (id: string) => {
    if (!editForm.title.trim()) return
    updateMemo({
      id,
      title: editForm.title,
      content: editForm.content
    })
  }

  const handleDelete = (id: string) => {
    if (window.confirm("このメモを削除しますか？")) {
      deleteMemo({ id })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Memos</h1>
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
              <Plus size={18} />
              新しいメモ
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <button type="button" onClick={() => signOut()} className="mb-8 bg-blue-500 w-28 text-white rounded px-4 py-1 hover:scale-105 transition-all">
          ログアウト
        </button>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">新しいメモを作成</h2>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="タイトルを入力..."
                  value={newMemo.title}
                  onChange={(e) => setNewMemo((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                />
                <textarea
                  placeholder="内容を入力..."
                  value={newMemo.content}
                  onChange={(e) => setNewMemo((prev) => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isCreating || !newMemo.title.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium">
                    <Save size={18} />
                    {isCreating ? "作成中..." : "作成"}
                  </button>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memos Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {data?.map((memo) => (
            <div key={memo.id} className="group h-[300px]">
              {editingId === memo.id ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 space-y-4 h-[300px]">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent font-semibold"
                  />
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(memo.id)}
                      disabled={isUpdating || !editForm.title.trim()}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium">
                      <Save size={14} />
                      {isUpdating ? "保存中..." : "保存"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-2">{memo.title}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button type="button" onClick={() => handleEdit(memo)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(memo.id)}
                          disabled={isDeleting}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 mb-4">{memo.content}</p>
                  </div>
                  <div className="text-xs text-slate-400 pt-3 border-t border-slate-100">{formatDate(memo.createdAt)}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {data?.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-600 mb-2">{"メモが見つかりません"}</h3>
            <p className="text-slate-500">{"新しいメモを作成してみましょう"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainPage
