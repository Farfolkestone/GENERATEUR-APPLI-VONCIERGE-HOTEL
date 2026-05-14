import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const EMOJIS = [
  "🍽️",
  "🍷",
  "🥐",
  "🍜",
  "☕",
  "🎨",
  "🎭",
  "🛍️",
  "🧖",
  "🌦️",
  "🚇",
  "🛎️",
  "⭐",
  "🏛️",
  "🌿",
  "🍸",
  "🗺️",
  "📸",
];

const MODULE_CATALOG = [
  {
    id: "bars",
    label: "Bars",
    emoji: "🍸",
    meta: "Cocktails · Rooftops",
    color: "#F4E7FF",
  },
  {
    id: "culture",
    label: "Culture",
    emoji: "🎭",
    meta: "Musées · Théâtres",
    color: "#FFF3D8",
  },
  {
    id: "shopping",
    label: "Shopping",
    emoji: "🛍️",
    meta: "Boutiques · Marchés",
    color: "#FFE8EE",
  },
  { id: "spa", label: "Spa", emoji: "🧖", meta: "Bien-être", color: "#E7F8F0" },
  {
    id: "meteo",
    label: "Météo",
    emoji: "🌦️",
    meta: "Prévisions locales",
    color: "#E8F1FF",
  },
  {
    id: "evenements",
    label: "Événements",
    emoji: "🎟️",
    meta: "Cette semaine",
    color: "#FFF0E8",
  },
];

const DEFAULT_CONTENT = {
  hotel: {
    name: "Hôtel du Marais",
    slug: "hotel-du-marais",
    version: "3.0.0",
    concierge: {
      name: "Léon",
      avatar: "🤵",
      message:
        "Le Marais n'a plus de secrets pour moi — posez-moi vos questions !",
      badgeLabel: "LÉON · CONCIERGE",
    },
  },
  theme: {
    colors: {
      accent: "#C83C3C",
      dark: "#1A2235",
      gold: "#D4A853",
      surface: "#F0EDE8",
      card: "#FFFFFF",
      border: "#E8E4DC",
      text: "#1C1C1C",
      muted: "#7A7870",
    },
    radius: 14,
  },
  modules: {
    accueil: {
      visible: true,
      modified: true,
      label: "Accueil",
      emoji: "🏠",
      blocks: [
        {
          id: "hero",
          type: "hero",
          label: "Hero Section",
          emoji: "🏨",
          visible: true,
          order: 0,
          config: {
            hotelName: "Hôtel du Marais",
            slogan: "Au cœur de Paris",
            overlayColor: "#1A2235",
            overlayOpacity: 55,
            image: "",
          },
        },
        {
          id: "concierge",
          type: "concierge",
          label: "Message Concierge",
          emoji: "🤵",
          visible: true,
          order: 1,
          config: {},
        },
        {
          id: "featured",
          type: "featured",
          label: "Pépites du moment",
          emoji: "⭐",
          visible: true,
          order: 2,
          config: {},
        },
        {
          id: "quickactions",
          type: "quickactions",
          label: "Accès rapides",
          emoji: "⚡",
          visible: true,
          order: 3,
          config: {},
        },
      ],
    },
    restaurants: {
      visible: true,
      modified: false,
      label: "Restaurants",
      emoji: "🍽️",
      color: "#E8F5EE",
      items: [
        {
          id: "r1",
          name: "Chez Janou",
          category: "Bistro Provençal",
          emoji: "🍷",
          image: "",
          price: "€€",
          distance: "4 min",
          description:
            "Une institution discrète du Marais. Mousse au chocolat à volonté.",
          phone: "+33 1 42 72 28 41",
          website: "https://chezjanou.com",
          recommended: true,
          visible: true,
        },
        {
          id: "r2",
          name: "Café de Flore",
          category: "Café Parisien",
          emoji: "🥐",
          image: "",
          price: "€€€",
          distance: "12 min",
          description:
            "Terrasse mythique pour un café et une pause très parisienne.",
          phone: "+33 1 45 48 55 26",
          website: "https://cafedeflore.fr",
          recommended: false,
          visible: true,
        },
        {
          id: "r3",
          name: "Pho Bida Manda",
          category: "Vietnamien",
          emoji: "🍜",
          image: "",
          price: "€",
          distance: "6 min",
          description:
            "Adresse simple, rapide et généreuse pour un bol parfumé.",
          phone: "+33 1 40 29 99 99",
          website: "",
          recommended: false,
          visible: true,
        },
      ],
    },
  },
  featured: [
    {
      id: "f1",
      name: "Chez Janou",
      category: "Restaurant",
      emoji: "🍷",
      image: "",
      price: "€€",
      distance: "4 min à pied",
      description: "Un bistro discret, la mousse choco à volonté…",
      phone: "+33 1 42 72 28 41",
      website: "https://chezjanou.com",
      recommended: true,
      visible: true,
    },
    {
      id: "f2",
      name: "Musée Picasso",
      category: "Culture",
      emoji: "🎨",
      image: "",
      price: "€€",
      distance: "8 min à pied",
      description:
        "Venez tôt le matin pour éviter la foule et profiter de la cour.",
      phone: "+33 1 85 56 00 36",
      website: "https://museepicassoparis.fr",
      recommended: true,
      visible: true,
    },
  ],
  quickActions: [
    {
      id: "qa1",
      name: "Restaurants",
      category: "Navigation",
      emoji: "🍽️",
      color: "#FFF0EE",
      description: "Les meilleures tables autour de l'hôtel",
      phone: "",
      website: "",
      price: "",
      distance: "",
      recommended: false,
      visible: true,
    },
    {
      id: "qa2",
      name: "Culture",
      category: "Navigation",
      emoji: "🎭",
      color: "#FFFBE8",
      description: "Musées, galeries et spectacles",
      phone: "",
      website: "",
      price: "",
      distance: "",
      recommended: false,
      visible: true,
    },
    {
      id: "qa3",
      name: "Services",
      category: "Hôtel",
      emoji: "🛎️",
      color: "#E8F5EE",
      description: "Room service, pressing et demandes",
      phone: "",
      website: "",
      price: "",
      distance: "",
      recommended: false,
      visible: true,
    },
    {
      id: "qa4",
      name: "Transports",
      category: "Pratique",
      emoji: "🚇",
      color: "#E8EFF5",
      description: "Métro, taxi et itinéraires",
      phone: "",
      website: "",
      price: "",
      distance: "",
      recommended: false,
      visible: true,
    },
  ],
};

const StoreContext = createContext(null);

function cloneCard(card, prefix) {
  return {
    ...card,
    id: uid(prefix),
    name: `${card.name} copie`,
    visible: true,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACTIVE_MODULE":
      return { ...state, activeModule: action.moduleId };
    case "OPEN_DRAWER":
      return { ...state, drawer: action.drawer };
    case "CLOSE_DRAWER":
      return { ...state, drawer: null };
    case "OPEN_MODULE_MODAL":
      return { ...state, moduleModalOpen: true };
    case "CLOSE_MODULE_MODAL":
      return { ...state, moduleModalOpen: false };
    case "UPDATE_HERO": {
      const blocks = state.content.modules.accueil.blocks.map((block) =>
        block.id === "hero"
          ? { ...block, config: { ...block.config, ...action.patch } }
          : block,
      );
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            accueil: {
              ...state.content.modules.accueil,
              blocks,
              modified: true,
            },
          },
        },
      };
    }
    case "UPDATE_CONCIERGE":
      return {
        ...state,
        content: {
          ...state.content,
          hotel: {
            ...state.content.hotel,
            concierge: { ...state.content.hotel.concierge, ...action.patch },
          },
        },
      };
    case "TOGGLE_BLOCK": {
      const blocks = state.content.modules.accueil.blocks.map((block) =>
        block.id === action.blockId
          ? { ...block, visible: !block.visible }
          : block,
      );
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            accueil: { ...state.content.modules.accueil, blocks },
          },
        },
      };
    }
    case "UPSERT_CARD": {
      const { section, card } = action;
      if (section === "restaurants") {
        const items = state.content.modules.restaurants.items.some(
          (item) => item.id === card.id,
        )
          ? state.content.modules.restaurants.items.map((item) =>
              item.id === card.id ? card : item,
            )
          : [card, ...state.content.modules.restaurants.items];
        return {
          ...state,
          content: {
            ...state.content,
            modules: {
              ...state.content.modules,
              restaurants: {
                ...state.content.modules.restaurants,
                items,
                modified: true,
              },
            },
          },
          drawer: null,
        };
      }
      const list = state.content[section].some((item) => item.id === card.id)
        ? state.content[section].map((item) =>
            item.id === card.id ? card : item,
          )
        : [card, ...state.content[section]];
      return {
        ...state,
        content: { ...state.content, [section]: list },
        drawer: null,
      };
    }
    case "DELETE_CARD": {
      const { section, id } = action;
      if (section === "restaurants") {
        const items = state.content.modules.restaurants.items.filter(
          (item) => item.id !== id,
        );
        return {
          ...state,
          content: {
            ...state.content,
            modules: {
              ...state.content.modules,
              restaurants: {
                ...state.content.modules.restaurants,
                items,
                modified: true,
              },
            },
          },
          drawer: null,
        };
      }
      return {
        ...state,
        content: {
          ...state.content,
          [section]: state.content[section].filter((item) => item.id !== id),
        },
        drawer: null,
      };
    }
    case "DUPLICATE_CARD": {
      const { section, card } = action;
      if (section === "restaurants") {
        const items = [
          cloneCard(card, "r"),
          ...state.content.modules.restaurants.items,
        ];
        return {
          ...state,
          content: {
            ...state.content,
            modules: {
              ...state.content.modules,
              restaurants: {
                ...state.content.modules.restaurants,
                items,
                modified: true,
              },
            },
          },
        };
      }
      return {
        ...state,
        content: {
          ...state.content,
          [section]: [cloneCard(card, section), ...state.content[section]],
        },
      };
    }
    case "TOGGLE_CARD": {
      const { section, id } = action;
      if (section === "restaurants") {
        const items = state.content.modules.restaurants.items.map((item) =>
          item.id === id ? { ...item, visible: !item.visible } : item,
        );
        return {
          ...state,
          content: {
            ...state.content,
            modules: {
              ...state.content.modules,
              restaurants: { ...state.content.modules.restaurants, items },
            },
          },
        };
      }
      return {
        ...state,
        content: {
          ...state.content,
          [section]: state.content[section].map((item) =>
            item.id === id ? { ...item, visible: !item.visible } : item,
          ),
        },
      };
    }
    case "ADD_DYNAMIC_MODULE": {
      const mod = action.module;
      if (state.content.modules[mod.id])
        return { ...state, activeModule: mod.id, moduleModalOpen: false };
      return {
        ...state,
        activeModule: mod.id,
        moduleModalOpen: false,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            [mod.id]: {
              visible: true,
              modified: true,
              dynamic: true,
              label: mod.label,
              emoji: mod.emoji,
              color: mod.color,
              items: [
                {
                  id: uid(mod.id),
                  name: `Nouvelle carte ${mod.label}`,
                  category: mod.label,
                  emoji: mod.emoji,
                  image: "",
                  price: "",
                  distance: "",
                  description: "Décrivez cette recommandation.",
                  phone: "",
                  website: "",
                  recommended: false,
                  visible: true,
                },
              ],
            },
          },
        },
      };
    }
    case "UPSERT_DYNAMIC_CARD": {
      const module = state.content.modules[action.moduleId];
      const items = module.items.some((item) => item.id === action.card.id)
        ? module.items.map((item) =>
            item.id === action.card.id ? action.card : item,
          )
        : [action.card, ...module.items];
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            [action.moduleId]: { ...module, items, modified: true },
          },
        },
        drawer: null,
      };
    }
    case "DELETE_DYNAMIC_CARD": {
      const module = state.content.modules[action.moduleId];
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            [action.moduleId]: {
              ...module,
              items: module.items.filter((item) => item.id !== action.id),
            },
          },
        },
        drawer: null,
      };
    }
    case "TOGGLE_DYNAMIC_CARD": {
      const module = state.content.modules[action.moduleId];
      const items = module.items.map((item) =>
        item.id === action.id ? { ...item, visible: !item.visible } : item,
      );
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            [action.moduleId]: { ...module, items },
          },
        },
      };
    }
    case "DUPLICATE_DYNAMIC_CARD": {
      const module = state.content.modules[action.moduleId];
      return {
        ...state,
        content: {
          ...state.content,
          modules: {
            ...state.content.modules,
            [action.moduleId]: {
              ...module,
              items: [cloneCard(action.card, action.moduleId), ...module.items],
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    content: DEFAULT_CONTENT,
    activeModule: "accueil",
    drawer: null,
    moduleModalOpen: false,
  });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function useStore() {
  return useContext(StoreContext);
}

function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function ImageOrEmoji({ item, size = 48 }) {
  return item.image ? (
    <img
      className="thumb"
      src={item.image}
      alt=""
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="emoji-thumb"
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {item.emoji}
    </div>
  );
}

function EmojiPicker({ value, onChange }) {
  return (
    <div className="emoji-picker">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className={emoji === value ? "emoji-choice active" : "emoji-choice"}
          onClick={() => onChange(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function ImageUploader({ label, value, onChange }) {
  const clear = () => onChange("");
  return (
    <div className="field">
      <label>{label}</label>
      <label className="upload-zone">
        {value ? (
          <img src={value} alt="Aperçu" />
        ) : (
          <span>🖼️ Cliquez pour importer une image locale</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            event.target.files?.[0] &&
            fileToBase64(event.target.files[0], onChange)
          }
        />
      </label>
      {value && (
        <button className="mini danger" type="button" onClick={clear}>
          Retirer l'image
        </button>
      )}
    </div>
  );
}

function Sidebar() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const modules = Object.entries(state.content.modules).map(([id, module]) => ({
    id,
    ...module,
  }));
  const filtered = modules.filter((module) =>
    module.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">PL</div>
        <div>
          <strong>ParisLocal</strong>
          <span>Studio</span>
        </div>
      </div>
      <div className="search">
        <span>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Modules…"
        />
      </div>
      <div className="module-list">
        {filtered.map((module) => (
          <button
            key={module.id}
            className={
              state.activeModule === module.id ? "module active" : "module"
            }
            onClick={() =>
              dispatch({ type: "SET_ACTIVE_MODULE", moduleId: module.id })
            }
          >
            <span
              className="module-emoji"
              style={{ background: module.color || "rgba(255,255,255,.1)" }}
            >
              {module.emoji}
            </span>
            <span>
              <strong>{module.label}</strong>
              <small>
                {module.items
                  ? `${module.items.length} cartes`
                  : `${module.blocks.length} blocs`}
              </small>
            </span>
            {module.modified && <em>modifié</em>}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <button
          className="add-module"
          onClick={() => dispatch({ type: "OPEN_MODULE_MODAL" })}
        >
          ＋ Ajouter un module
        </button>
        <button className="generate">⬇ Générer l'application</button>
      </div>
    </aside>
  );
}

function CardList({ title, section, cards, onAdd }) {
  const { dispatch } = useStore();
  return (
    <section className="panel-section">
      <header className="section-head">
        <h3>
          {title} <small>({cards.length})</small>
        </h3>
        <button onClick={onAdd}>+ Ajouter</button>
      </header>
      <p className="hint">
        Cartes complètes : image base64, emoji fallback, description, téléphone,
        site web, coup de cœur et visibilité.
      </p>
      <div className="card-stack">
        {cards.map((card) => (
          <article
            key={card.id}
            className={card.visible ? "studio-card" : "studio-card hidden-card"}
          >
            <ImageOrEmoji item={card} size={54} />
            <div className="card-copy">
              <strong>{card.name}</strong>
              <span>{card.category}</span>
              <p>{card.description}</p>
              <div>
                {card.price && <b>{card.price}</b>}
                {card.distance && <b>{card.distance}</b>}
                {card.recommended && <b>★ Coup de cœur</b>}
              </div>
            </div>
            <div className="card-actions">
              <button
                title="Éditer"
                onClick={() =>
                  dispatch({
                    type: "OPEN_DRAWER",
                    drawer: { mode: "edit", section, card },
                  })
                }
              >
                ✏️
              </button>
              <button
                title="Dupliquer"
                onClick={() =>
                  dispatch({ type: "DUPLICATE_CARD", section, card })
                }
              >
                📋
              </button>
              <button
                title="Masquer/Afficher"
                onClick={() =>
                  dispatch({ type: "TOGGLE_CARD", section, id: card.id })
                }
              >
                {card.visible ? "👁" : "🚫"}
              </button>
              <button
                title="Supprimer"
                onClick={() =>
                  dispatch({ type: "DELETE_CARD", section, id: card.id })
                }
              >
                🗑
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DynamicCardList({ moduleId, module }) {
  const { dispatch } = useStore();
  const newCard = () => ({
    id: uid(moduleId),
    name: "Nouvelle carte",
    category: module.label,
    emoji: module.emoji,
    image: "",
    price: "",
    distance: "",
    description: "",
    phone: "",
    website: "",
    recommended: false,
    visible: true,
  });
  return (
    <section className="panel-section">
      <header className="section-head">
        <h3>
          {module.emoji} {module.label} <small>({module.items.length})</small>
        </h3>
        <button
          onClick={() =>
            dispatch({
              type: "OPEN_DRAWER",
              drawer: { mode: "addDynamic", moduleId, card: newCard() },
            })
          }
        >
          + Ajouter
        </button>
      </header>
      <div className="card-stack">
        {module.items.map((card) => (
          <article
            key={card.id}
            className={card.visible ? "studio-card" : "studio-card hidden-card"}
          >
            <ImageOrEmoji item={card} size={54} />
            <div className="card-copy">
              <strong>{card.name}</strong>
              <span>{card.category}</span>
              <p>{card.description}</p>
            </div>
            <div className="card-actions">
              <button
                onClick={() =>
                  dispatch({
                    type: "OPEN_DRAWER",
                    drawer: { mode: "editDynamic", moduleId, card },
                  })
                }
              >
                ✏️
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "DUPLICATE_DYNAMIC_CARD", moduleId, card })
                }
              >
                📋
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_DYNAMIC_CARD",
                    moduleId,
                    id: card.id,
                  })
                }
              >
                {card.visible ? "👁" : "🚫"}
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "DELETE_DYNAMIC_CARD",
                    moduleId,
                    id: card.id,
                  })
                }
              >
                🗑
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeEditor() {
  const { state, dispatch } = useStore();
  const content = state.content;
  const hero = content.modules.accueil.blocks.find(
    (block) => block.id === "hero",
  );
  const newFeatured = () => ({
    id: uid("f"),
    name: "Nouvelle pépite",
    category: "Culture",
    emoji: "⭐",
    image: "",
    price: "€€",
    distance: "5 min",
    description: "Pourquoi cette adresse est spéciale ?",
    phone: "",
    website: "",
    recommended: true,
    visible: true,
  });
  const newQuick = () => ({
    id: uid("qa"),
    name: "Nouvel accès",
    category: "Navigation",
    emoji: "⚡",
    color: "#F0EDE8",
    image: "",
    price: "",
    distance: "",
    description: "Action rapide affichée sur l'accueil.",
    phone: "",
    website: "",
    recommended: false,
    visible: true,
  });

  return (
    <>
      <section className="panel-section">
        <header className="section-head">
          <h3>Hero</h3>
        </header>
        <div className="grid-2">
          <Field
            label="Nom hôtel"
            value={hero.config.hotelName}
            onChange={(v) =>
              dispatch({ type: "UPDATE_HERO", patch: { hotelName: v } })
            }
          />
          <Field
            label="Slogan"
            value={hero.config.slogan}
            onChange={(v) =>
              dispatch({ type: "UPDATE_HERO", patch: { slogan: v } })
            }
          />
        </div>
        <ImageUploader
          label="Image bannière réelle (base64 local)"
          value={hero.config.image}
          onChange={(v) =>
            dispatch({ type: "UPDATE_HERO", patch: { image: v } })
          }
        />
      </section>
      <section className="panel-section">
        <header className="section-head">
          <h3>Concierge</h3>
        </header>
        <div className="grid-2">
          <Field
            label="Nom"
            value={content.hotel.concierge.name}
            onChange={(v) =>
              dispatch({ type: "UPDATE_CONCIERGE", patch: { name: v } })
            }
          />
          <Field
            label="Avatar"
            value={content.hotel.concierge.avatar}
            onChange={(v) =>
              dispatch({ type: "UPDATE_CONCIERGE", patch: { avatar: v } })
            }
          />
        </div>
        <Field
          label="Message"
          multiline
          value={content.hotel.concierge.message}
          onChange={(v) =>
            dispatch({ type: "UPDATE_CONCIERGE", patch: { message: v } })
          }
        />
      </section>
      <CardList
        title="Pépites du moment"
        section="featured"
        cards={content.featured}
        onAdd={() =>
          dispatch({
            type: "OPEN_DRAWER",
            drawer: { mode: "add", section: "featured", card: newFeatured() },
          })
        }
      />
      <CardList
        title="Accès rapides"
        section="quickActions"
        cards={content.quickActions}
        onAdd={() =>
          dispatch({
            type: "OPEN_DRAWER",
            drawer: { mode: "add", section: "quickActions", card: newQuick() },
          })
        }
      />
    </>
  );
}

function RestaurantsEditor() {
  const { state, dispatch } = useStore();
  const newRestaurant = () => ({
    id: uid("r"),
    name: "Nouveau restaurant",
    category: "Cuisine locale",
    emoji: "🍽️",
    image: "",
    price: "€€",
    distance: "5 min",
    description:
      "Décrivez l'ambiance, les spécialités et le conseil concierge.",
    phone: "",
    website: "",
    recommended: false,
    visible: true,
  });
  return (
    <CardList
      title="Restaurants"
      section="restaurants"
      cards={state.content.modules.restaurants.items}
      onAdd={() =>
        dispatch({
          type: "OPEN_DRAWER",
          drawer: {
            mode: "add",
            section: "restaurants",
            card: newRestaurant(),
          },
        })
      }
    />
  );
}

function BlocksEditor() {
  const { state, dispatch } = useStore();
  return (
    <section className="panel-section">
      <header className="section-head">
        <h3>Blocs de la page Accueil</h3>
      </header>
      {state.content.modules.accueil.blocks.map((block) => (
        <article className="block-row" key={block.id}>
          <span>{block.emoji}</span>
          <strong>{block.label}</strong>
          <button
            onClick={() =>
              dispatch({ type: "TOGGLE_BLOCK", blockId: block.id })
            }
          >
            {block.visible ? "Visible" : "Masqué"}
          </button>
        </article>
      ))}
    </section>
  );
}

function EditorPanel() {
  const { state } = useStore();
  const activeModule = state.content.modules[state.activeModule];
  const isDynamic = activeModule?.dynamic;
  return (
    <main className="editor">
      <div className="topbar">
        <span>
          Studio › <strong>{activeModule?.label}</strong>
        </span>
        <div>
          <span className="live">● Live sync</span>
          <button>💾 Sauvegarder</button>
        </div>
      </div>
      <div className="editor-body">
        {state.activeModule === "accueil" && (
          <>
            <BlocksEditor />
            <HomeEditor />
          </>
        )}
        {state.activeModule === "restaurants" && <RestaurantsEditor />}
        {isDynamic && (
          <DynamicCardList
            moduleId={state.activeModule}
            module={activeModule}
          />
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  return (
    <div className="field">
      <label>{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function EditDrawer() {
  const { state, dispatch } = useStore();
  const drawer = state.drawer;
  const [draft, setDraft] = useState(drawer?.card || null);

  useEffect(() => {
    setDraft(drawer?.card || null);
  }, [drawer]);

  if (!drawer || !draft) return null;
  const patch = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const save = () => {
    if (drawer.moduleId)
      dispatch({
        type: "UPSERT_DYNAMIC_CARD",
        moduleId: drawer.moduleId,
        card: draft,
      });
    else
      dispatch({ type: "UPSERT_CARD", section: drawer.section, card: draft });
  };
  const remove = () => {
    if (drawer.moduleId)
      dispatch({
        type: "DELETE_DYNAMIC_CARD",
        moduleId: drawer.moduleId,
        id: draft.id,
      });
    else
      dispatch({ type: "DELETE_CARD", section: drawer.section, id: draft.id });
  };

  return (
    <div
      className="drawer-shell"
      onMouseDown={(e) =>
        e.target === e.currentTarget && dispatch({ type: "CLOSE_DRAWER" })
      }
    >
      <aside className="drawer">
        <header>
          <div>
            <small>Édition inline</small>
            <h2>
              {drawer.mode.startsWith("add")
                ? "Ajouter une carte"
                : `Modifier ${draft.name}`}
            </h2>
          </div>
          <button onClick={() => dispatch({ type: "CLOSE_DRAWER" })}>✕</button>
        </header>
        <div className="drawer-content">
          <ImageUploader
            label="Photo réelle"
            value={draft.image}
            onChange={(v) => patch("image", v)}
          />
          <div className="field">
            <label>Icône emoji (si pas de photo)</label>
            <EmojiPicker
              value={draft.emoji}
              onChange={(v) => patch("emoji", v)}
            />
          </div>
          <div className="grid-2">
            <Field
              label="Nom"
              value={draft.name}
              onChange={(v) => patch("name", v)}
            />
            <Field
              label="Catégorie"
              value={draft.category}
              onChange={(v) => patch("category", v)}
            />
          </div>
          <div className="grid-2">
            <Field
              label="Prix"
              value={draft.price}
              onChange={(v) => patch("price", v)}
            />
            <Field
              label="Distance"
              value={draft.distance}
              onChange={(v) => patch("distance", v)}
            />
          </div>
          <Field
            label="Description"
            multiline
            value={draft.description}
            onChange={(v) => patch("description", v)}
          />
          <div className="grid-2">
            <Field
              label="Téléphone"
              value={draft.phone}
              onChange={(v) => patch("phone", v)}
            />
            <Field
              label="Site web"
              value={draft.website}
              onChange={(v) => patch("website", v)}
            />
          </div>
          {"color" in draft && (
            <Field
              label="Couleur"
              type="color"
              value={draft.color}
              onChange={(v) => patch("color", v)}
            />
          )}
          <label className="check">
            <input
              type="checkbox"
              checked={!!draft.recommended}
              onChange={(e) => patch("recommended", e.target.checked)}
            />{" "}
            Coup de cœur
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={draft.visible !== false}
              onChange={(e) => patch("visible", e.target.checked)}
            />{" "}
            Afficher la carte
          </label>
        </div>
        <footer>
          <button className="danger" onClick={remove}>
            Supprimer
          </button>
          <button onClick={() => dispatch({ type: "CLOSE_DRAWER" })}>
            Fermer
          </button>
          <button className="primary" onClick={save}>
            Valider
          </button>
        </footer>
      </aside>
    </div>
  );
}

function ModuleModal() {
  const { state, dispatch } = useStore();
  if (!state.moduleModalOpen) return null;
  return (
    <div
      className="modal-shell"
      onMouseDown={(e) =>
        e.target === e.currentTarget && dispatch({ type: "CLOSE_MODULE_MODAL" })
      }
    >
      <section className="modal">
        <header>
          <div>
            <small>Modules dynamiques</small>
            <h2>Ajouter un module</h2>
          </div>
          <button onClick={() => dispatch({ type: "CLOSE_MODULE_MODAL" })}>
            ✕
          </button>
        </header>
        <div className="catalog">
          {MODULE_CATALOG.map((module) => (
            <button
              key={module.id}
              onClick={() => dispatch({ type: "ADD_DYNAMIC_MODULE", module })}
              disabled={!!state.content.modules[module.id]}
            >
              <span style={{ background: module.color }}>{module.emoji}</span>
              <strong>{module.label}</strong>
              <small>
                {state.content.modules[module.id] ? "Déjà ajouté" : module.meta}
              </small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function PreviewCard({ card, compact = false }) {
  if (!card.visible) return null;
  return (
    <article className={compact ? "preview-card compact" : "preview-card"}>
      <ImageOrEmoji item={card} size={compact ? 34 : 44} />
      <div>
        <strong>{card.name}</strong>
        <span>{card.category}</span>
        {!compact && <p>{card.description}</p>}
        <small>
          {card.distance} {card.price && `· ${card.price}`}{" "}
          {card.recommended && "· ★"}
        </small>
      </div>
    </article>
  );
}

function MobilePreview() {
  const { state } = useStore();
  const { content } = state;
  const hero = content.modules.accueil.blocks.find(
    (block) => block.id === "hero",
  );
  const visibleDynamic = Object.entries(content.modules).filter(
    ([, module]) => module.dynamic && module.visible,
  );
  const heroStyle = hero.config.image
    ? {
        backgroundImage: `linear-gradient(rgba(26,34,53,.45), rgba(26,34,53,.45)), url(${hero.config.image})`,
      }
    : {
        background: `linear-gradient(135deg, ${content.theme.colors.dark}, ${content.theme.colors.accent})`,
      };
  return (
    <aside className="preview-pane">
      <div className="preview-title">
        📱 Preview mobile <span>Live</span>
      </div>
      <div className="phone">
        <div className="notch" />
        <div className="screen">
          <section className="hero-preview" style={heroStyle}>
            <small>Bienvenue au</small>
            <h1>{hero.config.hotelName}</h1>
            <p>{hero.config.slogan}</p>
          </section>
          <section className="concierge">
            <b>{content.hotel.concierge.badgeLabel}</b>
            <p>
              {content.hotel.concierge.avatar} {content.hotel.concierge.message}
            </p>
          </section>
          <h3>★ Pépites du moment</h3>
          <div className="horizontal">
            {content.featured.map((card) => (
              <PreviewCard key={card.id} card={card} compact />
            ))}
          </div>
          <h3>Accès rapides</h3>
          <div className="quick-grid">
            {content.quickActions
              .filter((card) => card.visible)
              .map((card) => (
                <div key={card.id} style={{ background: card.color }}>
                  <ImageOrEmoji item={card} size={32} />
                  <span>{card.name}</span>
                </div>
              ))}
          </div>
          <h3>Restaurants</h3>
          {content.modules.restaurants.items.map((card) => (
            <PreviewCard key={card.id} card={card} />
          ))}
          {visibleDynamic.map(([id, module]) => (
            <div key={id}>
              <h3>
                {module.emoji} {module.label}
              </h3>
              {module.items.map((card) => (
                <PreviewCard key={card.id} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function ParisLocalStudio() {
  return (
    <StoreProvider>
      <div className="app-shell">
        <Sidebar />
        <EditorPanel />
        <MobilePreview />
        <EditDrawer />
        <ModuleModal />
      </div>
    </StoreProvider>
  );
}
