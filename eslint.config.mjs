import eslint from '@eslint/js';                                               
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';                                                           
import globals from 'globals';                                                 
import tseslint from 'typescript-eslint';                                      
                                                                                   
    export default tseslint.config(                                                
      {                                                                            
        ignores: ['eslint.config.mjs', 'dist', 'node_modules', 'coverage'],        
      },                                                                           
      eslint.configs.recommended,                                                  
      // Trocamos 'recommended' por 'strict' para regras profissionais             
      ...tseslint.configs.strictTypeChecked,                                       
      eslintPluginPrettierRecommended,                                             
      {                                                                            
        languageOptions: {                                                         
          globals: {                                                               
            ...globals.node,                                                       
            ...globals.jest,                                                       
          },                                                                       
          sourceType: 'module',                                                    
          parserOptions: {                                                         
            projectService: true,                                                  
            tsconfigRootDir: import.meta.dirname,                                  
          },                                                                       
        },                                                                         
      },                                                                           
      {                                                                            
        rules: {                                                                   
          // 1. Tipagem Estrita                                                    
          '@typescript-eslint/no-explicit-any': 'error',                 
          '@typescript-eslint/explicit-function-return-type': 'error',
          '@typescript-eslint/explicit-module-boundary-types': 'error',            
                                                                                   
          '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern':    
  '^_' }],     
          '@typescript-eslint/no-floating-promises': 'error',              
          'no-console': ['warn', { allow: ['warn', 'error'] }],           
          'eqeqeq': ['error', 'always'], 
          "prettier/prettier": ["error", { endOfLine: "auto" }]
        },
      },
    );