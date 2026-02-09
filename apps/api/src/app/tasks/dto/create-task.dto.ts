import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category!: string;

  @IsIn(['Todo', 'InProgress', 'Done'])
  status!: 'Todo' | 'InProgress' | 'Done';
}
