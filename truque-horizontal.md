# Truque horizontal: foto em pé num espaço deitado

Para quando uma foto de estúdio vertical (3:4) precisa caber num espaço horizontal (por exemplo 617:407) sem cortar a cabeça nem os pés.

## Como funciona

1. A foto é redimensionada para a altura do espaço e centralizada.
2. As laterais vazias são preenchidas com uma cor lisa: a média de uma faixa estreita (4% da largura, 30% de altura) no canto superior de cada borda da própria foto. Assim o fundo off-white do estúdio continua.
3. A foto entra com uma máscara que esmaece as bordas esquerda e direita (rampa de 1/8 da largura da foto). Onde o corpo encosta na borda, ele some aos poucos em vez de cortar seco.

## O que não fazer

Não esticar a última coluna de pixels da borda para preencher as laterais. Quando braço ou perna encostam na borda, isso cria faixas cor de pele (foi o defeito da primeira versão).

## Limites

- Funciona bem com fundo de estúdio liso. Fundo com degradê forte ou cinza (como as fotos "de perto" do Mandacaru e do Bacuri) deixa a emenda levemente visível.
- Não serve para fotos externas (cenário ocupa a borda inteira).

## Como rodar (macOS, sem dependências)

Compile uma vez e rode por foto. Os argumentos são: entrada, saída PNG, largura, altura.

```bash
swiftc -O pad2.swift -o pad2
./pad2 entrada.png saida.png 1234 814
sips -s format jpeg -s formatOptions 82 saida.png --out final.jpg
```

## pad2.swift

```swift
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let a=CommandLine.arguments; let W=Int(a[3])!, H=Int(a[4])!
let src=CGImageSourceCreateWithURL(URL(fileURLWithPath:a[1]) as CFURL,nil)!; let im=CGImageSourceCreateImageAtIndex(src,0,nil)!
let cs=CGColorSpaceCreateDeviceRGB()
func avgColor(_ r:CGRect)->(CGFloat,CGFloat,CGFloat){ var px=[UInt8](repeating:0,count:4); let c=CGContext(data:&px,width:1,height:1,bitsPerComponent:8,bytesPerRow:4,space:cs,bitmapInfo:CGImageAlphaInfo.noneSkipLast.rawValue)!; c.interpolationQuality = .high; c.draw(im.cropping(to:r)!,in:CGRect(x:0,y:0,width:1,height:1)); return (CGFloat(px[0])/255,CGFloat(px[1])/255,CGFloat(px[2])/255) }
let w=CGFloat(im.width), h=CGFloat(im.height)
let tl=avgColor(CGRect(x:0,y:0,width:w*0.04,height:h*0.3)), tr=avgColor(CGRect(x:w*0.96,y:0,width:w*0.04,height:h*0.3))
let ctx=CGContext(data:nil,width:W,height:H,bitsPerComponent:8,bytesPerRow:0,space:cs,bitmapInfo:CGImageAlphaInfo.noneSkipLast.rawValue)!
ctx.interpolationQuality = .high
ctx.setFillColor(CGColor(red:tl.0,green:tl.1,blue:tl.2,alpha:1)); ctx.fill(CGRect(x:0,y:0,width:W/2,height:H)); ctx.setFillColor(CGColor(red:tr.0,green:tr.1,blue:tr.2,alpha:1)); ctx.fill(CGRect(x:W/2,y:0,width:W-W/2,height:H))
let s=Double(H)/Double(im.height); let dw=Int(Double(im.width)*s); let x0=(W-dw)/2
let f=max(30,dw/8)
let mctx=CGContext(data:nil,width:dw,height:1,bitsPerComponent:8,bytesPerRow:0,space:CGColorSpaceCreateDeviceGray(),bitmapInfo:CGImageAlphaInfo.none.rawValue)!
let mg=CGGradient(colorsSpace:CGColorSpaceCreateDeviceGray(),colors:[CGColor(gray:0,alpha:1),CGColor(gray:1,alpha:1),CGColor(gray:1,alpha:1),CGColor(gray:0,alpha:1)] as CFArray,locations:[0,CGFloat(f)/CGFloat(dw),1-CGFloat(f)/CGFloat(dw),1])!
mctx.drawLinearGradient(mg,start:.zero,end:CGPoint(x:dw,y:0),options:[])
let rect=CGRect(x:x0,y:0,width:dw,height:H)
ctx.saveGState(); ctx.clip(to:rect,mask:mctx.makeImage()!); ctx.draw(im,in:rect); ctx.restoreGState()
let d=CGImageDestinationCreateWithURL(URL(fileURLWithPath:a[2]) as CFURL,UTType.png.identifier as CFString,1,nil)!
CGImageDestinationAddImage(d,ctx.makeImage()!,nil); CGImageDestinationFinalize(d)
```
