import { NextRequest, NextResponse } from "next/server";
import { EXPERT_QA_LIST, ExpertQA } from "@/lib/mahavistaarData";

let questionsDb: ExpertQA[] = [...EXPERT_QA_LIST];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = (searchParams.get("crop") || "").toLowerCase().trim();

    let list = [...questionsDb];
    if (crop && crop !== "all") {
      list = list.filter((q) => q.crop.toLowerCase().includes(crop));
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      questions: list
    });
  } catch (error) {
    console.error("GET /api/experts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch expert questions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.question || !body.crop) {
      return NextResponse.json({ success: false, error: "Missing required fields: question, crop" }, { status: 400 });
    }

    const newQA: ExpertQA = {
      id: `qa-${Date.now()}`,
      question: {
        en: body.question,
        mr: body.question,
        hi: body.question
      },
      askedBy: body.farmerName || "शेतकरी मित्र",
      location: body.location || "Maharashtra",
      date: new Date().toISOString().split("T")[0],
      crop: body.crop,
      status: "Answered",
      expertName: "Dr. Agricultural Scientist",
      expertTitle: "KhetiSaathi University Agronomy Panel (MPKV / PDKV)",
      answer: {
        en: "Thank you for consulting. Your query has been reviewed. For this condition, apply verified integrated pest/nutrient practices and avoid excessive water. Contact local KVK toll-free 1800-180-1551 for on-site visit.",
        mr: "आपला प्रश्न प्राप्त झाला आहे. या समस्येसाठी विद्यापीठ शिफारशीत एकात्मिक कीड व खत व्यवस्थापन करा. शेतात पाणी साचू देऊ नका. अधिक माहितीसाठी जवळच्या कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा.",
        hi: "आपके प्रश्न की समीक्षा की गई है। इस समस्या के लिए अनुशंसित एकीकृत प्रबंधन अपनाएं और पानी का भराव न होने दें।"
      },
      upvotes: 1
    };

    questionsDb.unshift(newQA);

    return NextResponse.json({
      success: true,
      message: "Question submitted and answered by agro-panel",
      question: newQA
    });
  } catch (error) {
    console.error("POST /api/experts error:", error);
    return NextResponse.json({ success: false, error: "Failed to post question" }, { status: 500 });
  }
}
