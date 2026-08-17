# GIF 逐帧裁剪工具(存档)
# 用途:把主人提供的横版 GIF 裁成正方形头像,保留全部帧与帧延迟。
# 用法:pwsh -File crop-gif.ps1 -InPath <gif> -OutPath <out> -CropX 0 -CropY 0 -CropW 300 -CropH 300
# 示例(01.gif 500x363 居中裁 363x363):
#   pwsh -File crop-gif.ps1 -InPath 01.gif -OutPath av01-center.gif -CropX 68 -CropY 0 -CropW 363 -CropH 363

param(
  [Parameter(Mandatory=$true)][string]$InPath,
  [Parameter(Mandatory=$true)][string]$OutPath,
  [Parameter(Mandatory=$true)][int]$CropX,
  [Parameter(Mandatory=$true)][int]$CropY,
  [Parameter(Mandatory=$true)][int]$CropW,
  [Parameter(Mandatory=$true)][int]$CropH
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Image]::FromFile($InPath)
$frameCount = $src.GetFrameCount([System.Drawing.Imaging.FrameDimension]::Time)
Write-Output ("source: " + $src.Width + "x" + $src.Height + " frames=" + $frameCount)

$delayItem = $null
try { $delayItem = $src.GetPropertyItem(0x5100) } catch { }

$gifEnc = $null
foreach ($e in [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()) {
  if ($e.MimeType -eq 'image/gif') { $gifEnc = $e; break }
}
if ($null -eq $gifEnc) { throw 'no gif encoder' }

$multi = New-Object System.Drawing.Imaging.EncoderParameters(1)
$multi.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::MultiFrame)
$frameParam = New-Object System.Drawing.Imaging.EncoderParameters(1)
$frameParam.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::FrameDimensionTime)
$flush = New-Object System.Drawing.Imaging.EncoderParameters(1)
$flush.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::SaveFlag, [long][System.Drawing.Imaging.EncoderValue]::Flush)

$srcRect = New-Object System.Drawing.Rectangle($CropX, $CropY, $CropW, $CropH)
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $CropW, $CropH)

$holder = $null
for ($i = 0; $i -lt $frameCount; $i++) {
  $src.SelectActiveFrame([System.Drawing.Imaging.FrameDimension]::Time, $i) | Out-Null
  $frame = New-Object System.Drawing.Bitmap($CropW, $CropH)
  $g = [System.Drawing.Graphics]::FromImage($frame)
  $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  if ($i -eq 0) {
    if ($delayItem -ne $null) { try { $frame.SetPropertyItem($delayItem) } catch { } }
    $frame.Save($OutPath, $gifEnc, $multi)
    $holder = $frame
  } else {
    $holder.SaveAdd($frame, $frameParam)
    $frame.Dispose()
  }
}
$holder.SaveAdd($flush)
$holder.Dispose()
$src.Dispose()

$check = [System.Drawing.Image]::FromFile($OutPath)
Write-Output ("output: " + $check.Width + "x" + $check.Height + " frames=" + $check.GetFrameCount([System.Drawing.Imaging.FrameDimension]::Time))
$check.Dispose()
