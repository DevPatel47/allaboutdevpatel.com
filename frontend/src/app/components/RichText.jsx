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
function RichText({ text = '', className = '', as: Wrapper = 'div' }) {
    if (!text) return null;

    const escapeHtml = (s) =>
        s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const rawLines = text.replace(/\r\n?/g, '\n').split('\n');

    const blocks = [];
    let para = [];
    let ul = [];
    let ol = [];

    const pushPara = () => {
        if (para.length) {
            blocks.push({ type: 'p', lines: para.slice() });
            para = [];
        }
    };
    const pushUl = () => {
        if (ul.length) {
            blocks.push({ type: 'ul', items: ul.slice() });
            ul = [];
        }
    };
    const pushOl = () => {
        if (ol.length) {
            blocks.push({ type: 'ol', items: ol.slice() });
            ol = [];
        }
    };
    const flushAll = () => {
        pushPara();
        pushUl();
        pushOl();
    };

    rawLines.forEach((l0) => {
        const line = l0.trimEnd();
        if (!line.trim()) {
            flushAll();
            return;
        }
        const mBul = line.match(/^\s*[-*]\s+(.+)/);
        if (mBul) {
            pushPara();
            pushOl();
            ul.push(mBul[1]);
            return;
        }
        const mNum = line.match(/^\s*\d+\.\s+(.+)/);
        if (mNum) {
            pushPara();
            pushUl();
            ol.push(mNum[1]);
            return;
        }
        pushUl();
        pushOl();
        para.push(line);
    });
    flushAll();

    const renderInline = (s, k) => {
        let safe = escapeHtml(s);
        safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        safe = safe.replace(/(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
        return <span key={k} dangerouslySetInnerHTML={{ __html: safe }} />;
    };

    return (
        <Wrapper className={`rich-text space-y-3 ${className}`}>
            {blocks.map((b, i) => {
                if (b.type === 'p') {
                    const parts = [];
                    b.lines.forEach((ln, j) => {
                        if (j) parts.push(<br key={`br-${i}-${j}`} />);
                        parts.push(renderInline(ln, `p-${i}-${j}`));
                    });
                    return <p key={i}>{parts}</p>;
                }
                if (b.type === 'ul')
                    return (
                        <ul key={i} className="list-disc list-inside space-y-1">
                            {b.items.map((it, j) => (
                                <li key={j}>{renderInline(it, `ul-${i}-${j}`)}</li>
                            ))}
                        </ul>
                    );
                if (b.type === 'ol')
                    return (
                        <ol key={i} className="list-decimal list-inside space-y-1">
                            {b.items.map((it, j) => (
                                <li key={j}>{renderInline(it, `ol-${i}-${j}`)}</li>
                            ))}
                        </ol>
                    );
                return null;
            })}
        </Wrapper>
    );
}

export default RichText;
