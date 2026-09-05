import React, { useState } from 'react';
import { 
  MessageSquare, 
  Heart, 
  CornerDownRight, 
  Pin, 
  Flag, 
  MoreVertical, 
  Trash2, 
  Sparkles, 
  Send,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Comment } from '../../types';

interface CommentSectionProps {
  storyId: string;
  chapterId?: string;
  chapterNumber?: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ storyId, chapterId, chapterNumber }) => {
  const { 
    comments, 
    addComment, 
    toggleLikeComment, 
    reportComment, 
    currentUser, 
    currentRole,
    moderateComment,
    setIsAuthModalOpen 
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [reportModalCommentId, setReportModalCommentId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  // Filter comments for this story
  const storyComments = comments.filter(c => {
    if (chapterId) {
      return c.storyId === storyId && c.chapterId === chapterId;
    }
    return c.storyId === storyId;
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!inputContent.trim()) return;

    addComment(storyId, inputContent.trim(), chapterId, chapterNumber);
    setInputContent('');
  };

  const handlePostReply = (parentCommentId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!replyContent.trim()) return;

    addComment(storyId, replyContent.trim(), chapterId, chapterNumber, parentCommentId);
    setReplyContent('');
    setReplyToId(null);
  };

  const handleConfirmReport = () => {
    if (reportModalCommentId) {
      reportComment(reportModalCommentId, reportReason);
      setReportModalCommentId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            Reader Comments ({storyComments.length})
          </h3>
        </div>
      </div>

      {/* Main Comment Input */}
      <form onSubmit={handlePostComment} className="space-y-3">
        <div className="flex items-start space-x-3">
          <img
            src={currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
            alt="user avatar"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-200 shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder={currentUser ? "গল্পটি কেমন লাগলো? মন্তব্য লিখুন..." : "মন্তব্য লিখতে প্রথমে সাইন ইন করুন..."}
              rows={3}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all resize-none"
            />
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Post Comment</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="divide-y divide-slate-100 space-y-4 pt-2">
        {storyComments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
            এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
          </div>
        ) : (
          storyComments.map((comment) => (
            <div key={comment.id} className="pt-4 space-y-3">
              
              {/* Comment Card */}
              <div className="flex items-start space-x-3">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                />
                
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                      {comment.userRole === 'author' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">Author</span>
                      )}
                      {comment.userRole === 'admin' && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold">Admin</span>
                      )}
                      {comment.isPinned && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5 fill-amber-700" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                    </div>

                    {/* Admin / Mod Actions */}
                    <div className="flex items-center space-x-1 text-slate-400">
                      {currentRole === 'admin' && (
                        <>
                          <button
                            onClick={() => moderateComment(comment.id, 'pin')}
                            title="Pin comment"
                            className={`p-1 hover:text-amber-600 ${comment.isPinned ? 'text-amber-600' : ''}`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moderateComment(comment.id, 'delete')}
                            title="Delete comment"
                            className="p-1 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setReportModalCommentId(comment.id)}
                        title="Report comment"
                        className="p-1 hover:text-rose-500"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {comment.content}
                  </p>

                  {/* Interaction buttons */}
                  <div className="flex items-center space-x-4 pt-1 text-xs text-slate-500">
                    <button
                      onClick={() => toggleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 hover:text-purple-600 transition-colors cursor-pointer ${
                        comment.userLiked ? 'text-rose-600 font-bold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? 'fill-rose-600' : ''}`} />
                      <span>{comment.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Reply Input Box */}
                  {replyToId === comment.id && (
                    <div className="pt-3 pl-2 border-l-2 border-purple-200 space-y-2">
                      <textarea
                        placeholder="Write your reply..."
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setReplyToId(null)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReply(comment.id)}
                          className="px-4 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-4 border-l-2 border-slate-100 space-y-3 pt-3 mt-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-2.5">
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900">{reply.userName}</span>
                              {reply.userRole === 'author' && (
                                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">Author</span>
                              )}
                              <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                            </div>
                            <p className="text-xs text-slate-700 font-serif leading-relaxed">{reply.content}</p>
                            <button
                              onClick={() => toggleLikeComment(reply.id)}
                              className={`flex items-center space-x-1 text-[11px] pt-0.5 text-slate-500 hover:text-purple-600 ${
                                reply.userLiked ? 'text-rose-600 font-bold' : ''
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${reply.userLiked ? 'fill-rose-600' : ''}`} />
                              <span>{reply.likesCount}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Report Comment Modal */}
      {reportModalCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="font-bold text-slate-900 text-base">Report Comment</h4>
            <p className="text-xs text-slate-600">Please select a reason for reporting this comment to moderators:</p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-600"
            >
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Harassment or Hate Speech">Harassment or Hate Speech</option>
              <option value="Spam / Commercial Promotion">Spam / Commercial Promotion</option>
              <option value="Spoilers without Warning">Spoilers without Warning</option>
            </select>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setReportModalCommentId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReport}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
