# Seller Center — MitiMiti

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v16.0.10)
- **Librería**: [React](https://react.dev/) (v19.2.3)
- **Lenguaje**: TypeScript (v5.9.3)
- **Estado Global**: [Zustand](https://zustand-demo.pmnd.rs/) (v5.0.8)
- **UI**: [Material-UI](https://mui.com/) (v7.3.6)
- **Gráficos**: [ApexCharts](https://apexcharts.com/) (v5.8.1)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) (v7.68.0)
- **Consultas**: [GraphQL Request](https://github.com/prisma-labs/graphql-request) (v7.4.0)
- **Estilos**: [Emotion](https://emotion.sh/docs/introduction) (v11.14.0)
- **Gestión de Dependencias**: Yarn (v1.22.22)
- **Pruebas**:
  - [Jest](https://jestjs.io/) (v30.2.0)
  - [Testing Library](https://testing-library.com/) (v16.3.2)
- **Linter**: ESLint (v9.39.2)
- **Formateador**: Prettier (v3.7.4)

## Prerequisites

- Node.js >=22 (Recommended)
- Package Manager: Yarn >=1.22.22 (Recommended)

## Getting Started

### 1. Clone the repository

```sh
git clone https://interrapidisimo@dev.azure.com/interrapidisimo/SitiosWeb/_git/Seller_Center_MitiMiti
cd Seller_Center_MitiMiti
```

### 2. Install dependencies

```sh
yarn install
```

### 3. Configure environment variables
```sh
cp .env.example .env
```

### 4. Start the development server:
```sh
yarn dev
```
Open your browser and navigate to `http://localhost:8083` to see the application running.

### To build the application for production, run the following command:

```sh
yarn build
```

## To start the production server, run the following command:

```sh
yarn start
```

## Testing
To run tests, use the following command:
for more scripts check the package.json file, in the "scripts" section.

Tests live in the `__tests__` directory, mirroring the structure of the `src` directory.

```sh
__tests__/
  app/
    product/
      page.test.tsx
  components/
    index.test.tsx
```
**Naming convention:** `<ComponentName>.test.tsx`

Run all tests:
```sh
yarn test
```

## Contributing
1. Branch off `Desarrollo_Release_SellerCenter` using the convention:
```
   Desarrollo_Feature_SellerCenter_HU<ticket>_<scope>_<initials>
```
Example: `Desarrollo_Feature_SellerCenter_HU123_products_JDoe`

2. Open a PR against `Desarrollo_Release_SellerCenter` on Azure DevOps with a clear description.
