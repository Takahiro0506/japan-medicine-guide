import { supabase } from "@/lib/supabase";

export const dynamic = "force-static";

type GroupName = "symptom" | "about_me" | "at_counter";

interface PhraseRow {
  slug: string;
  group_name: GroupName;
  text_en: string;
  text_ja: string;
  sort_order: number;
}

const GROUP_ORDER: GroupName[] = ["symptom", "about_me", "at_counter"];

const GROUP_LABELS: Record<GroupName, string> = {
  symptom: "Your symptoms",
  about_me: "About you",
  at_counter: "Ask the pharmacist",
};

async function getPhrases() {
  const { data } = await supabase
    .from("phrases")
    .select("slug, group_name, text_en, text_ja, sort_order")
    .order("sort_order", { ascending: true })
    .returns<PhraseRow[]>();
  return data ?? [];
}

export default async function PhrasesPage() {
  const phrases = await getPhrases();

  return (
    <main className="page">
      <div className="brandbar">
        <span className="brandmark">Japan Medicine Guide</span>
        <span className="backlink">Phrases</span>
      </div>

      <div className="phrase-hint">
        <div className="phrase-hint-t">Show this screen to the pharmacist.</div>
        <div className="phrase-hint-d">No need to say it out loud &mdash; just point at the line.</div>
      </div>

      {GROUP_ORDER.map((groupName) => {
        const rows = phrases.filter((phrase) => phrase.group_name === groupName);
        if (rows.length === 0) return null;
        return (
          <div className="pgroup" key={groupName}>
            <span className="label">{GROUP_LABELS[groupName]}</span>
            {rows.map((phrase) => (
              <div className="prow" key={phrase.slug}>
                <div className="prow-en">{phrase.text_en}</div>
                <div className="prow-ja">{phrase.text_ja}</div>
              </div>
            ))}
          </div>
        );
      })}

      <p className="disclaimer">This page does not suggest any product. It only helps you talk to the pharmacist.</p>
    </main>
  );
}
