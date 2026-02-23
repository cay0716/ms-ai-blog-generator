import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { StyleType, ToneType } from '@/types/generate';

interface Props {
  style: StyleType;
  tone: ToneType;
  onStyleChange: (v: StyleType) => void;
  onToneChange: (v: ToneType) => void;
}

export function StyleFieldset({
  style,
  tone,
  onStyleChange,
  onToneChange,
}: Props) {
  return(
    <fieldset className='flex flex-col md:flex-row gap-2'>
      <legend className='sr-only'>글 설정</legend>
      {/* 1. 템플릿 선택 */}
      <div className='w-full md:w-[50%]'>
        <label className="font-semibold">글 템플릿</label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="템플릿 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutorial">튜토리얼</SelectItem>
            <SelectItem value="til">TIL</SelectItem>
            <SelectItem value="troubleshooting">트러블 슈팅</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 2. 말투 선택 */}
      <div className='w-full md:w-[50%]'>
        <label className="font-semibold">작성 스타일</label>
        <Select value={tone} onValueChange={onToneChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="스타일 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kind">친절한 설명형</SelectItem>
            <SelectItem value="minimal">간결한 개발자 스타일</SelectItem>
            <SelectItem value="formal">개발 일지 스타일</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </fieldset>
  )
}