const User = require("../models/UserModels");
require("dotenv").config();

exports.ensureUser = async (req, res) => {
  const { clerkId } = req.body;
  if (!clerkId) return res.status(400).json({ error: "Falta clerkId" });

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" Clerk API error:", response.status, errorText);
        return res.status(500).json({ error: "No se pudo obtener el usuario desde Clerk" });
      }

      const clerkUser = await response.json();

      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses[0].email_address,
        name: `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim(),
        imageUrl: clerkUser.image_url,
        role: "user",
      });

      console.log(" Usuario creado:", user.email);
    } else {
      console.log(" Usuario ya existe:", user.email);
    }

    return res.status(200).json({ ok: true, user });
  } catch (error) {
    console.error(" Error en ensure-user:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    console.error(" Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

exports.setUserRole = async (req, res) => {
  const { clerkId, role } = req.body;

  if (!clerkId || !role) {
    return res.status(400).json({ error: "Faltan datos clerkId o role" });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log(` Rol actualizado: ${user.email} → ${user.role}`);
    return res.status(200).json({ message: "Rol actualizado", user });
  } catch (error) {
    console.error(" Error al asignar rol:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};