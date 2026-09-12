<#
runpy.ps1 —— 群雄割据 标准 Python 执行入口
====================================================
用法:  .\tools\runpy.ps1 tools\scripts_tmp\xxx.py [参数...]
规则:  凡要处理中文的 Python 逻辑，一律写 .py 文件再经本入口执行；
       禁止 `python -X utf8 -c "含中文代码"` 内联（PowerShell 5.1 传参按
       GBK 编码 + 多层引号剥皮，中文字节必炸）。
本入口只接收脚本路径参数，PS 侧零中文字面量传递。
#>
param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$Script,

  [Parameter(ValueFromRemainingArguments=$true)]
  [string[]]$Args
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Script)) {
  Write-Error "脚本不存在: $Script"
  exit 1
}
if ([IO.Path]::GetExtension($Script) -ne ".py") {
  Write-Error "本入口只接受 .py 文件: $Script"
  exit 1
}

# 控制台切 UTF-8 代码页 + 显式输出编码（缓解 stdio 乱码；救不了 -c 传参）
chcp 65001 > $null
$env:PYTHONIOENCODING = "utf-8"

python -X utf8 $Script @Args
exit $LASTEXITCODE
