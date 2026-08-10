import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/accounts";

function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } catch (error: any) {
      const data = error?.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.values(data)
          .flat()
          .join(" ");

        setError(
          messages || "Registration failed.",
        );
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="first_name"
        placeholder="First name"
        value={form.first_name}
        onChange={handleChange}
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="last_name"
        placeholder="Last name"
        value={form.last_name}
        onChange={handleChange}
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="phone_number"
        placeholder="Phone number"
        value={form.phone_number}
        onChange={handleChange}
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="confirm_password"
        type="password"
        placeholder="Confirm password"
        value={form.confirm_password}
        onChange={handleChange}
        required
        className="w-full rounded-lg border px-4 py-3"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Creating account..."
          : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;