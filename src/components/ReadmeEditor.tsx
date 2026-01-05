import React, { useEffect, useState } from 'react';

interface Props {
  isAdmin: boolean;
}

const KEY_EN = 'README_EN';
const KEY_MS = 'README_MS';

const defaultEn = `Cafe's Little Helper — Project README\n\nThis README can be edited by Admin/Owner from the Project Info page. Use the English editor to provide public-facing information, deployment instructions, or links to resources.`;
const defaultMs = `Cafe's Little Helper — README Projek\n\nREADME ini boleh disunting oleh Admin/Owner dari halaman Maklumat Projek. Gunakan editor Bahasa Melayu untuk menyediakan maklumat awam, arahan penyebaran, atau pautan kepada sumber.`;

const ReadmeEditor: React.FC<Props> = ({ isAdmin }) => {
  const [en, setEn] = useState('');
  const [ms, setMs] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEn(localStorage.getItem(KEY_EN) || defaultEn);
    setMs(localStorage.getItem(KEY_MS) || defaultMs);
  }, []);

  const save = () => {
    localStorage.setItem(KEY_EN, en);
    localStorage.setItem(KEY_MS, ms);
    setEditing(false);
    alert('README saved locally');
  };

  const resetDefaults = () => {
    if (!confirm('Reset README to defaults?')) return;
    setEn(defaultEn);
    setMs(defaultMs);
    localStorage.setItem(KEY_EN, defaultEn);
    localStorage.setItem(KEY_MS, defaultMs);
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Project README</h3>
          <div className="space-x-2">
            {isAdmin ? (
              <>
                <button onClick={() => setEditing(e => !e)} className="px-3 py-1 bg-blue-600 text-white rounded">{editing ? 'Cancel' : 'Edit'}</button>
                <button onClick={resetDefaults} className="px-3 py-1 bg-gray-200 rounded">Reset</button>
              </>
            ) : null}
          </div>
        </div>

        {editing && isAdmin ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">English</label>
              <textarea value={en} onChange={e => setEn(e.target.value)} rows={6} className="w-full border rounded p-2 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bahasa Melayu</label>
              <textarea value={ms} onChange={e => setMs(e.target.value)} rows={6} className="w-full border rounded p-2 font-mono text-sm" />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none whitespace-pre-wrap text-sm text-gray-800">
            <h4 className="font-semibold">English</h4>
            <pre className="bg-gray-50 p-3 rounded">{localStorage.getItem(KEY_EN) || en}</pre>
            <h4 className="font-semibold mt-3">Bahasa Melayu</h4>
            <pre className="bg-gray-50 p-3 rounded">{localStorage.getItem(KEY_MS) || ms}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadmeEditor;
