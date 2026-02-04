# Gestione Task Avanzato

Applicazione Single Page Application (SPA) per la gestione avanzata di task, sviluppata con React, TypeScript e moderne librerie di state management.

## 🚀 Funzionalità Implementate

### Requisiti Funzionali
- ✅ **Visualizzazione Task**: Elenco completo con titolo, descrizione, stato e data di creazione
- ✅ **Aggiunta Task**: Form validato per la creazione di nuovi task
- ✅ **Modifica Task**: Possibilità di modificare titolo e descrizione
- ✅ **Eliminazione Task**: Rimozione con conferma utente
- ✅ **Cambio Stato**: Dropdown per aggiornare lo stato (aperto → in corso → completato)
- ✅ **Persistenza Dati**: LocalStorage con simulazione API REST
- ✅ **Validazione Form**: Validazione completa con feedback in tempo reale

### Requisiti Tecnici
- ✅ **State Management**: Zustand (alternativa moderna a Redux)
- ✅ **TypeScript**: Progetto completamente tipizzato
- ✅ **React Router DOM**: Routing con 3 viste principali
  - `/tasks` - Lista dei task
  - `/tasks/new` - Creazione nuovo task
  - `/tasks/:id` - Modifica task esistente
- ✅ **Mock API REST**: Simulazione completa con async/await e localStorage

## 📦 Installazione

### Prerequisiti
- Node.js >= 16.x
- npm >= 8.x

### Comandi

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Esegui i test 
npm test
```

## 🏗️ Architettura del Progetto

```
/
├── api/
│   └── taskApi.ts          # Mock API con localStorage
├── components/
│   ├── TaskItem.tsx        # Componente singolo task
│   ├── TaskForm.tsx        # Form riutilizzabile con validazione
│   ├── Modal.tsx           # Componente modale
│   ├── LoadingSpinner.tsx  # Componente loading
│   └── ErrorMessage.tsx    # Componente errori
├── pages/
│   ├── TasksPage.tsx       # Pagina lista task
│   ├── NewTaskPage.tsx     # Pagina creazione task
│   └── EditTaskPage.tsx    # Pagina modifica task
├── store/
│   └── taskStore.ts        # Zustand store per state management
├── types/
│   └── task.ts             # TypeScript interfaces e types
└── App.tsx                 # Entry point con routing
```

## 🛠️ Scelte Tecniche

### State Management: Zustand
Ho scelto **Zustand** invece di Redux/Redux Toolkit per i seguenti motivi:
- **Boilerplate minimale**: Meno codice, più produttività
- **TypeScript-first**: Supporto nativo eccellente
- **Performance**: Ottimizzato per re-rendering selettivi
- **Developer Experience**: API intuitiva e facile da testare

### Form Management: React Hook Form
- Validazione performante senza re-rendering eccessivi
- Supporto TypeScript completo
- API dichiarativa e intuitiva
- Gestione errori integrata

### Mock API Layer
Ho implementato un layer di astrazione che simula chiamate REST reali:
- **Async/Await**: Simula latenza di rete
- **CRUD completo**: GET, POST, PUT, DELETE
- **Error handling**: Gestione errori come API reale
- **LocalStorage**: Persistenza dati tra sessioni
- **Type-safe**: Tipizzato con TypeScript

### Routing
Utilizzo di React Router DOM v6 con pattern moderni:
- Navigazione programmatica con `useNavigate`
- Parametri dinamici per modifica task
- Redirect automatico per route non trovate
- Layout coerente tra le pagine

## 🎨 UI/UX

- **Design System**: Tailwind CSS per styling consistente
- **Icone**: Lucide React per iconografia moderna
- **Toast Notifications** (Sonner): 
  - Notifiche success per creazione, modifica ed eliminazione task
  - Notifiche info per cambio stato
  - Notifiche error per operazioni fallite
  - Auto-dismiss dopo 3 secondi
  - Posizionamento top-right con close button
- **Modale Personalizzata**: 
  - Componente Modal riutilizzabile con varianti (danger, warning, info)
  - Chiusura con pulsante X
  - Prevenzione scroll del body
- **Feedback Utente**: 
  - Loading states durante operazioni asincrone
  - Messaggi di errore user-friendly
  - Conferme per azioni distruttive
- **Responsive**: Layout ottimizzato per desktop e mobile

## 📊 Gestione dello Stato

Lo stato globale è gestito con Zustand e include:

```typescript
interface TaskState {
  tasks: Task[];              // Lista task
  loading: boolean;           // Stato caricamento
  error: string | null;       // Gestione errori
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDTO) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskDTO) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}
```

## 🔒 Validazione

Validazione implementata con React Hook Form:
- **Titolo**: Obbligatorio, min 3 caratteri, max 100 caratteri
- **Descrizione**: Obbligatoria, min 10 caratteri, max 500 caratteri
- **Feedback real-time**: Messaggi di errore visibili durante la digitazione

## ✅ Test Unitari

Il progetto include test unitari per alcuni componenti e per lo store con **Jest** e **React Testing Library**.

### 📊 Coverage dei Test

| File | Descrizione |
|------|-------------|
| **taskStore.test.ts** | Test custom hook Zustand con tutte le azioni |
| **TaskForm.test.tsx** | Test validazione form, submit, error handling |
| **Modal.test.tsx** | Test modale conferma |


## 📝 Note

- I dati sono salvati nel localStorage del browser
- Il reset dei dati può essere effettuato cancellando il localStorage
- L'applicazione funziona completamente offline dopo il primo caricamento
- Non sono state utilizzate librerie di UI components (Material-UI, Chakra, etc.) per dimostrare competenze CSS/Tailwind

---

**Autore**: Prova Pratica Senior Frontend  
**Data**: 2026  
**Tempo di sviluppo stimato**: ~8 ore  
**Tecnologie**: React 18 + TypeScript + Zustand + React Router + Tailwind CSS

  