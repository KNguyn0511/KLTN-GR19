import { createVertex } from "@ai-sdk/google-vertex";
import { streamText, convertToModelMessages, tool, type UIMessage } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const vertex = createVertex({
  project: process.env.GOOGLE_VERTEX_PROJECT,
  location: process.env.GOOGLE_VERTEX_LOCATION || "global",
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY
        ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/"/g, "").trim()
        : undefined,
    },
  },
});

export async function POST(req: Request) {
  try {
    const { messages = [] }: { messages: UIMessage[] } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = await streamText({
      model: vertex("gemini-2.5-flash"),
      // @ts-ignore
      maxSteps: 8,
      temperature: 0.3,

      system: `Bạn là chuyên gia Build PC tại NetTech.
      
QUY TẮC BẮT BUỘC:
1. Khi khách muốn Build PC, bạn KHÔNG ĐƯỢC tìm "bộ PC". Hãy gọi tool 'search_products' để tìm linh kiện đầu tiên (thường là 'vga' hoặc 'cpu') cao cấp nhất trong ngân sách.
2. Hiển thị từng sản phẩm theo đúng mẫu Markdown:

![ảnh]([image])
**[ [name] ]([link])**
- **Giá:** [price]
- **SKU:** [sku]
[🛒 Thêm vào giỏ hàng]([cartLink])
---
3. Sau khi hiển thị linh kiện, hãy hỏi khách có muốn tiếp tục chọn linh kiện tiếp theo không.
4. DANH MỤC: 'cpu', 'mainboard', 'ram', 'vga', 'ssd', 'psu', 'case', 'cooler', 'laptop-gaming', 'laptop-van-phong'.`,

      messages: modelMessages,

      tools: {
        search_products: tool({
          description: "Tìm kiếm linh kiện PC hoặc Laptop.",
          execute: async (args: any) => {
            const search = String(args?.search || "").trim();
            const category = String(args?.category || "").trim();
            const budget = Number(args?.budget) || undefined;

            try {
              const params = new URLSearchParams({ limit: "10" });
              if (search) params.append("search", search);
              if (category) params.append("category", category);
              if (budget) params.append("maxPrice", budget.toString());

              const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001"}/products?` + params.toString();
              console.log("TOOL CALL URL:", apiUrl);
              
              const res = await fetch(apiUrl, { cache: "no-store" });
              const data = await res.json();
              const products = data.products || [];

              if (products.length === 0) return "Không tìm thấy sản phẩm.";

              const resultList = products.slice(0, 5).map((p: any) => {
                let imageUrl = "http://localhost:3000/images/pink.jpg";
                if (p.images && p.images.length > 0) {
                  const img = p.images[0];
                  imageUrl = img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/` + img.replace(/^\//, "");
                }

                const productData = {
                  id: p._id,
                  name: p.name || "Sản phẩm",
                  price: p.price || 0,
                  image: imageUrl,
                  sku: p.sku || "N/A"
                };
                const encodedData = encodeURIComponent(JSON.stringify(productData));

                return {
                  id: p._id,
                  name: p.name || "Sản phẩm",
                  sku: p.sku || "N/A",
                  price: (p.price || 0).toLocaleString("vi-VN") + " VNĐ",
                  rawPrice: p.price || 0,
                  link: "http://localhost:3000/products/" + p._id,
                  image: imageUrl,
                  cartLink: "https://nettech.vn/cart/add?data=" + encodedData
                };
              });

              return JSON.stringify(resultList);
            } catch (err) {
              return "Lỗi kết nối kho.";
            }
          },
          // @ts-ignore
          inputSchema: z.object({
            search: z.string().optional(),
            category: z.string().optional(),
            budget: z.number().optional(),
          }),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
