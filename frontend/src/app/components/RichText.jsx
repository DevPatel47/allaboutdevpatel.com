import React from 'react';

/**
 * RichText
 * Supports:
 *  - Paragraphs (blank line separated)
 *  - Line breaks (single newline)
 *  - Unordered lists: lines starting with - or *
 *  - Ordered lists: lines starting with 1. / 2. etc
 *  - **bold**, *italic*
 *  - HTML is escaped to avoid XSS
 */
function RichText({ text = '', className = '' }) {
    if (!text || typeof text !== 'string') return null;

    // Escape HTML first
    const esc = (s) =>
        s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const lines = text.replace(/\r\n?/g, '\n').split('\n');

    const blocks = [];
    let para = [];
    let ulist = [];
    let olist = [];

    const flushPara = () => {
        if (para.length) {
            blocks.push({ type: 'p', lines: para.slice() });
            para = [];
        }
    };
    const flushU = () => {
        if (ulist.length) {
            blocks.push({ type: 'ul', items: ulist.slice() });
            ulist = [];
        }
    };
    const flushO = () => {
        if (olist.length) {
            blocks.push({ type: 'ol', items: olist.slice() });
            olist = [];
        }
    };
    const flushAll = () => {
        flushPara();
        flushU();
        flushO();
    };

    lines.forEach((raw) => {
        const line = raw.trimEnd(); // preserve intentional blank detection
        if (!line.trim()) {
            flushAll();
            return;
        }
        const mBul = line.match(/^\s*[-*]\s+(.+)/);
        if (mBul) {
            flushPara();
            flushO();
            ulist.push(mBul[1]);
            return;
        }
        const mNum = line.match(/^\s*\d+\.\s+(.+)/);
        if (mNum) {
            flushPara();
            flushU();
            olist.push(mNum[1]);
            return;
        }
        // normal paragraph line
        flushU();
        flushO();
        para.push(line);
    });
    flushAll();

    const renderInline = (s, idxBase) => {
        // After escaping HTML, apply inline formatting tokens
        let safe = esc(s);
        // Bold: **text**
        safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic: *text* (avoid bold we already handled)
        safe = safe.replace(/(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
        return <span key={idxBase} dangerouslySetInnerHTML={{ __html: safe }} />;
    };

    let key = 0;
    const nodes = blocks.map((b, i) => {
        if (b.type === 'p') {
            // Single newlines inside paragraph -> <br/>
            const parts = [];
            b.lines.forEach((ln, j) => {
                if (j) parts.push(<br key={`br-${i}-${j}`} />);
                parts.push(renderInline(ln, `p-${i}-${j}`));
            });
            return (
                <p key={i} className="whitespace-pre-wrap">
                    {parts}
                </p>
            );
        }
        if (b.type === 'ul') {
            return (
                <ul key={i} className="list-disc list-inside space-y-1">
                    {b.items.map((it, j) => (
                        <li key={j}>{renderInline(it, `ul-${i}-${j}`)}</li>
                    ))}
                </ul>
            );
        }
        if (b.type === 'ol') {
            return (
                <ol key={i} className="list-decimal list-inside space-y-1">
                    {b.items.map((it, j) => (
                        <li key={j}>{renderInline(it, `ol-${i}-${j}`)}</li>
                    ))}
                </ol>
            );
        }
        return null;
    });

    return <div className={`rich-text space-y-3 ${className}`}>{nodes}</div>;
}

export default RichText;
