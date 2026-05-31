#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.joinpath('src')
EXTS = {'.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.html', '.md'}


def remove_comments(text: str) -> str:
    # remove JSX comments {/* ... */}
    text = re.sub(r"\{\/\*[\s\S]*?\*\/\}", "", text)
    # remove block comments /* ... */
    text = re.sub(r"/\*[\s\S]*?\*/", "", text)
    # remove HTML comments <!-- ... -->
    text = re.sub(r"<!--[\s\S]*?-->", "", text)

    # remove // comments that are not inside string literals
    out = []
    i = 0
    n = len(text)
    in_s = in_d = in_b = False
    esc = False
    while i < n:
        ch = text[i]
        next_ch = text[i+1] if i+1 < n else ''

        if esc:
            out.append(ch)
            esc = False
            i += 1
            continue

        if ch == '\\':
            out.append(ch)
            esc = True
            i += 1
            continue

        if in_s:
            out.append(ch)
            if ch == "'":
                in_s = False
            i += 1
            continue

        if in_d:
            out.append(ch)
            if ch == '"':
                in_d = False
            i += 1
            continue

        if in_b:
            out.append(ch)
            if ch == '`':
                in_b = False
            i += 1
            continue

        # start of string
        if ch == "'":
            in_s = True
            out.append(ch)
            i += 1
            continue
        if ch == '"':
            in_d = True
            out.append(ch)
            i += 1
            continue
        if ch == '`':
            in_b = True
            out.append(ch)
            i += 1
            continue

        # line comment
        if ch == '/' and next_ch == '/':
            # skip until end of line
            i += 2
            while i < n and text[i] != '\n':
                i += 1
            # keep the newline (if any)
            if i < n and text[i] == '\n':
                out.append('\n')
                i += 1
            continue

        out.append(ch)
        i += 1

    return ''.join(out)


def process_file(path: Path) -> bool:
    text = path.read_text(encoding='utf-8')
    new = remove_comments(text)
    if new != text:
        path.write_text(new, encoding='utf-8')
        return True
    return False


def main():
    if not SRC.exists():
        print('src directory not found:', SRC)
        return
    changed = []
    for p in sorted(SRC.rglob('*')):
        if p.is_file() and p.suffix in EXTS:
            try:
                if process_file(p):
                    changed.append(str(p))
            except Exception as e:
                print('error processing', p, e)
    if changed:
        print('Updated files:')
        for c in changed:
            print(' -', c)
    else:
        print('No changes made.')


if __name__ == '__main__':
    main()
