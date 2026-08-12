import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendEmailCode, verifyEmailCode, saveProfile } from "@/lib/pr/auth";

export function EmailCodeForm({
  role,
  extraLabel,
  onAuthenticated,
}: {
  role: "cliente" | "mercado";
  extraLabel?: string;
  onAuthenticated: (name: string) => void;
}) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendEmailCode(email.trim());
      setStep("code");
      toast.success("Código enviado para " + email);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar o código.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmailCode(email.trim(), code.trim());
      await saveProfile(
        role === "mercado"
          ? { role, marketName: name || "Meu mercado" }
          : { role, fullName: name || undefined },
      );
      toast.success("Conta confirmada!");
      onAuthenticated(name || (email.split("@")[0] ?? "Usuário"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "code") {
    return (
      <form className="mt-6 space-y-4" onSubmit={verify}>
        <div className="space-y-1.5">
          <Label htmlFor="codigo">Código enviado para {email}</Label>
          <Input
            id="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={code}
            onChange={(ev) => setCode(ev.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Confira sua caixa de entrada (e o spam). O código expira em alguns minutos.
          </p>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Verificando…" : "Confirmar código"}
        </Button>
        <Button type="button" variant="ghost" className="w-full" disabled={loading} onClick={() => void sendEmailCode(email.trim()).then(() => toast.success("Novo código enviado."))}>
          Reenviar código
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => setStep("email")}>
          Usar outro e-mail
        </Button>
      </form>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={send}>
      <div className="space-y-1.5">
        <Label htmlFor="nome-auth">{extraLabel ?? "Nome"}</Label>
        <Input id="nome-auth" value={name} onChange={(ev) => setName(ev.target.value)} placeholder={role === "mercado" ? "Mercado Aurora" : "Seu nome"} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email-auth">E-mail</Label>
        <Input id="email-auth" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="voce@email.com" required />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "Enviando…" : "Receber código por e-mail"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Enviamos um código de verificação para o seu e-mail. Sem senha: seu cadastro é criado no primeiro acesso.
      </p>
    </form>
  );
}
