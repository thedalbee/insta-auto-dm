"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";

interface Trigger {
  id: string;
  keyword: string;
  responseMsg: string;
  enabled: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 폼 상태
  const [keyword, setKeyword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // 트리거 목록 조회
  const fetchTriggers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/triggers");
      if (!res.ok) throw new Error("Failed to fetch triggers");
      const data = await res.json();
      setTriggers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchTriggers();
  }, []);

  // 폼 제출 (생성 또는 수정)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!keyword.trim() || !responseMsg.trim()) {
      setError("Both fields are required");
      return;
    }

    try {
      setLoading(true);
      let res;

      if (editingId) {
        // 수정
        res = await fetch(`/api/triggers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, responseMsg }),
        });
      } else {
        // 생성
        res = await fetch("/api/triggers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, responseMsg }),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save trigger");
      }

      setSuccess(editingId ? "Trigger updated!" : "Trigger created!");
      setKeyword("");
      setResponseMsg("");
      setEditingId(null);
      await fetchTriggers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // 트리거 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/triggers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trigger");
      setSuccess("Trigger deleted!");
      await fetchTriggers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // 수정 모드 활성화
  const handleEdit = (trigger: Trigger) => {
    setEditingId(trigger.id);
    setKeyword(trigger.keyword);
    setResponseMsg(trigger.responseMsg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Trigger Management</h1>
          <p className="text-gray-600">
            Create keyword-based triggers to automatically send DM responses
          </p>
        </div>

        {/* 폼 */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Keyword
              </label>
              <Input
                type="text"
                placeholder="e.g., 'promo', 'discount', 'help'"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Response Message
              </label>
              <Textarea
                placeholder="The message to send when someone comments with this keyword..."
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setKeyword("");
                    setResponseMsg("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
            {success}
          </div>
        )}

        {/* 트리거 목록 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Active Triggers</h2>
          {loading && triggers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : triggers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No triggers yet. Create one to get started!
            </div>
          ) : (
            <div className="grid gap-4">
              {triggers.map((trigger) => (
                <Card key={trigger.id} className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{trigger.keyword}</div>
                    <p className="text-gray-600 text-sm mt-2">
                      {trigger.responseMsg}
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                      Created: {new Date(trigger.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(trigger)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(trigger.id)}
                      disabled={loading}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
