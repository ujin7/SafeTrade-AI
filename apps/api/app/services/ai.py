import json
import os

from dotenv import load_dotenv
from anthropic import Anthropic

from app.data.used_trade import USED_TRADE_CHECKLIST
from app.data.real_estate import REAL_ESTATE_CHECKLIST

load_dotenv()

_client: Anthropic | None = None

def _get_client() -> Anthropic:
    global _client
    if _client is None:
        _client = Anthropic()
    return _client


_CHECKLISTS = {
    "used_trade": USED_TRADE_CHECKLIST,
    "real_estate": REAL_ESTATE_CHECKLIST,
}


def suggest_signals(category: str, input_text: str) -> list[str]:
    checklist = _CHECKLISTS[category]
    items_desc = "\n".join(
        f"- id: {item['id']}, 항목: {item['label']}"
        for item in checklist
    )

    prompt = f"""다음은 사기 위험 체크리스트 항목들입니다:

{items_desc}

아래 거래 내용을 읽고, 위 체크리스트 중 해당하는 항목의 id를 JSON 배열로만 응답하세요.
다른 텍스트 없이 JSON 배열만 반환하세요. 해당하는 항목이 없으면 빈 배열 []을 반환하세요.

거래 내용:
{input_text}"""

    message = _get_client().messages.create(
        model="claude-haiku-4-5",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )

    text = message.content[0].text.strip()
    start = text.find("[")
    end = text.rfind("]") + 1
    if start == -1 or end == 0:
        return []

    suggested_ids: list = json.loads(text[start:end])
    valid_ids = {item["id"] for item in checklist}
    return [sid for sid in suggested_ids if sid in valid_ids]
