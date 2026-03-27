---
title: "C++ OOP"
date: 2026-3-28

description: "笔记"
sidebar: false
aside: true
outline: deep
---
# C++
##  OOP
### index 

[[1,18]内联函数 (inline function)](#anchor1)   
[[1.19]const](#anchor2)                       
[[1.21]引用](#anchor3)              
[[1.22]向上造型](#anchor4)             
[[1.23]多态](#anchor5)                
[[1.24]多态实现](#anchor6)            
[[1.25]引用再研究](#anchor7)          
[[1.26]拷贝构造Ⅰ & [1.27]拷贝构造ⅠⅠ](#anchor8)      
[[总结]](#anchor9)   
[[1.28]静态对象 & [1.29]静态成员](#anchor11)            
[[1.30]运算符重载](#anchor12)              
[[1.34]模板（templates）](#anchor13)               
[[1.36]异常](#anchor14)               

  

Only declarations are allowed to be in .h
- extern variables
- function
- class/struct declaration

进入scope时即对 对象分配空间
构造函数在定义类的对象时运行
析构(~)函数在对象离开scope时运行

```c++
struct Y{
int x;
float i;
Y(int c);

};

Y y1[]={Y(1),Y(2),Y(3)};
```


- 成员函数的指针
```cpp
class Time{};
void(Time:: * p3)(); // 指向Time类公用成员函数的指针变量p3
p3 = &Time::get_time; // 使p3指向Time类公用成员函数get_time
(t1.*p3)(); //调用对象t1中p3所指的成员函数(即t1.get_time( ))
```


- this指针
```cpp
int Box∷volume( ){return(height*width*length);}
// 
int Box∷volume(Box *this){
return(this->height * this->width * this->length);
//return((*this).height * (*this).width * (*this).length);
}

//调用:  a[0].volume(&a[0]);
```


### new
```c++
new int;
new int[10];
new Stash; //分配空间，再构造函数
delete p; //析构函数，再收回空间
delete []p;

int *psome=new int [10];
delete []psome;
```

### friend
- 很多东西可以是friend
```c++
struct X; //前项声明
struct Y{
	void f(X* );
};

struct X{
private:int i;
public:
	friend void Y::f(X* );
	
	friend struct Z;
	friend void h();
	
 


}
```

initialized lists:   `A() :i(0)`

```c++
class A{
public: 
	A(int ii):i(ii){};
private:
	int i;
};
class B: public A{
public: 
	B():A(15){};
}
```
- B 由A继承，A为父类，B为子类
- 子类中及其对象可使用父类public函数，不能直接访问父类private变量
- `protected` ：子类只能在类中使用父类`protected`  的函数，不能在main 中使用
- 当父类使用构造函数时，子类构造（初始化列表）。父类先构造
- 析构先子类
### 函数重载(overload)
- 函数的名称与返回类型相同，编译器根据函数所定义的参数类型不同找到对应的函数
- 当父类出现函数重载，子类再次定义同名函数，子类中将发生函数隐藏(hide)，所有父类该名的函数隐藏（应指出域）
缺省参数（default argument)
可预先给定参数值,给定值的必须都在右侧连续

### 内联函数[1,18] (inline function) {#anchor1}
- 保留函数的空间，但是嵌入到调用的地方，使汇编代码减少
- 声明和定义都加上`inline`关键字，与一般函数不同，必须在.h文件中**同时包括声明和定义**
  >[!tip]
  >原因：编译器只同时处理一个编译单元
- 典型的gain speed at the expense of space.
- 和C的宏比起来，具有类型检查功能
- 事实上，类的public内声明与定义同时的函数就是inline function，此时不需要关键字.如果需要分开，则将定义放在同文件的类之外，并加上`inline`关键字

---

### [1.19]const {#anchor2}
- const 在\*前：所指变量不能通过指针修改
-  const在\*后：指针是const（不能再指向别的内存）
- 函数const，保证函数不修改任何成员变量
```c++
int Date::get_day() const  {
}
```

> [!info]
> 常对象
> ```cpp
> Time const t1(12,34,46);
> //t1是常对象 ⇔
> 
> const Time t1(12,34,46);
> ```
> - 常对象保证所有成员变量不被修改
> - 因此常对象不可调用非const的函数
> 
> 常类成员
> - 类中的常成员变量，只能使用构造函数的初始化列表来初始化
>   
> `mutable`关键字
> - 对成员变量修饰，将某数据成员声明为可变的
> - `mutable int cnt;`
> - 使const的函数依然能够修改`cnt`

---

### [1.21]引用 {#anchor3}
```c++
char& r=c;
```
- r称为c的别名

- ```c++
const int &z=x;
//不能通过z修改x
  ```
- 与指针不同，引用一经绑定，不可再修改此绑定关系
- ```c++
  int &*p; //illegal! No pointers to reference
  int *&p; //legal!
  ```

---

### [1.22]向上造型 {#anchor4}
- 这里揭示了C++的OOP的底层虚假性
```c++
#include<iostream>
using namespace std;
class A{

public:
    int i;
    A():i(10){}

};

class B: public A{

private:

    int j;

public:
    B():j(20){}
    void f(){cout<<"B.j="<<j<<endl;}
};

int main(){
    A a;
    B b;
    cout<<a.i<<" "<<b.i<<endl;
    b.f();
    int *p= (int *)(&a);
    int *q= (int *)(&b);
    *p=100;
    cout<<"！"<<"a.i="<<a.i<<endl;
    *q=200;
    cout<<"！"<<"b.i="<<b.i<<endl;
    q++;
    *q=2000;
    b.f();
    return 0;
}
```

---

### [1.23]多态 {#anchor5}
- `Virtual`关键字：
```c++
class Shape{
public:
	Shape ();
	virtual ~Shape();
	virtual void render();

}

class Ellipse : public Shape(){
Ellipse(float maj,float minr); //构造函数
virtual void render();
……
}
Ellipse ell(10,20);  //定义对象

void render(Shape *p){
	p->render();
}

```
- 当`Shape`类被继承时，对于virtual关键字的函数，子类的同名函数与其产生联系。
这时子类同名函数`virtual`关键字 可加可不加
- 父类`Shape`将具有许多子类。
- 此程序根据不同形状属性，调用对应的`render()`画出图形
- `virtual`作用
  - 当没有`virtual`：
    根据[[#[1.22]向上造型]]，调用`render(&ell)`会调用Shape的`render()`.
  - 当加上`virtual`:
    程序在**运行**时进行检查，调用正确的`render()`函数
- 于是，我们实现了多态性，可理解为用指针/引用时调用函数的动态绑定

---


### [1.24]多态实现 {#anchor6}
>[!info]
>C++的一切都可以用C来实现
- 即vprt与vtable
- 当类定义中含`virtual`时，对象的首地址为vptr
- vptr为指针类型，指向vtable 
- vtable存放所有虚函数的入口地址
![](./1.24.png)
- 现有
```c++
class A{};
class B: public A {};
A a;
B b;
A *p= &b;
p->f();
// a=b; 这是合法的，但是vptr不参与赋值
```

  - 如果f()是`virtual`的，将调用`b.f()`，否则`a.f()`
  ---
  - 当父类会被继承，且通过指向父类指针new子类，析构函数需要做成virtual，例如上代码中
```c++
A *p= new B;
delete p;
```
- 这时析构必须做成`virtual`
---
- 关于返回类型（**协变返回类型**）
  -  通常情况下，重写虚函数时，子类的函数签名（包括参数和返回类型）必须与父类完全一致。但是，C++ 允许一个特例：**如果返回类型是类本身的指针或引用，子类重写的函数可以返回该类型的“派生类（子类）”指针或引用。**

---

### [1.25]引用再研究 {#anchor7}
- 
```c++
class X{
	public:
	int &my;
	X(int &a);  //注意构造函数接收的引用
}
X::X(int &a):my(a){};
```
  - 当类中有成员变量是引用类型，必须初始化列表绑定引用！
- 显然，返回引用的函数不能返回（该函数）的本地变量.
- 当函数返回引用时，可以作为左值🤔 
- pass by reference,pass by const reference
- ```c++
  void func(int &);
  func(i*3); //error 所传的东西需要能做左值
  ```
  这里的一种explanation是编译器会创建一个临时const变量保存i\*3，错误的原因是类型不匹配

---

### [1.26]拷贝构造Ⅰ & [1.27]拷贝构造ⅠⅠ {#anchor8}
形式：
- ```c++
  class A{
  public:
	  A(const A &){}
  };
  ```
- 拷贝构造函数**定义了"一个对象如何复制自己"**
- 此时，当对象本身（而不是指针/引用）作为参数，也发生了隐藏的拷贝构造
```c++
void func(A a){};
func(x); //发生拷贝构造
```
- 例如，当对象内构造函数定义指针时，如果**不**使用拷贝构造，可能出现对象直接复制后各自的指针指向同一块内存
- 建议在C++中使用<string\>，省去char \*需要的拷贝构造
- 将拷贝构造作为private:禁止拷贝构造

---


### 总结 {#anchor9}
截至目前，创建一个类时需要
- defualt constructor
- copy constructor
- virtual destructor

---


### [1.28]静态对象 & [1.29]静态成员 {#anchor11}

### Static Objects
- global objects的构造函数在`main`之前调用，程序结束时析构
⚠️不同文件的全局的对象初始化顺序未定义

### Static Data Member
  - 静态成员变量：属于类，因此类的所有对象共享
  - 类内声明，**必须在类外定义**
  - 注意`initialized list`只能对非静态成员初始化
  - 可通过`类名::`访问
因此，静态的成员变量/函数可理解为类的属性，在对象定义之前就可以访问它们，因为是“属于类的”
- 静态的成员函数只能访问静态的成员变量，原因是它没有this指针


---

### [1.30]运算符重载 {#anchor12}
- 可被重载的运算符：existing operators
- 函数名：`operator`"被重载的运算符“
- example:`const String String::operator +(const String& that)    

  consider:
  - 参数数量，如”+“的重载作为全局函数需要2参数，作为类的成员函数只需要1参数（还有一个是this指针），显然传递引用
  - 算子是否被修改，决定了参数是否`const`，函数是否`const`
  - return value是什么：修改自己还是制造新的对象， 新的对象是否可作左值（是否返回reference,是否const)       
   - 返回reference可以连续赋值     

- 可维护性：实践中当同时重载一系列运算符时，常常通过调用重载过的运算符来实现（如重载=与!=时，后者调用前者）。而inline保证性能不损失

---

*重载赋值*：
- 主要当存在动态内存操作等需求时需要重载
- 成员函数。自定义赋值后`return *this` 
一种写法：
```c++
T & T::operator=(const T & rhs){
if (self != rhs){    //！ 当类中包含指针操作时，不判断可能出错
//赋值
}
return *this;
}
```

- 另一种操作是做`private`重载赋值号，使该类对象**无法被赋值**


---

*类型转换*
>[!note]
>- 编译器能够使得一些隐式(implicit)类型转换是成立的
```c++
class A{
public:
	A() {};
	
};

class B{
public:
	B(const A &) {}   // !
	
};

void f(B) {}

int main(){
	A a;
	f(a); //编译器能够用a先构造B作为f的参数
}
```

- 如果B构造函数语句加上`explicit`关键字，则B构造函数必须显式情况下被调用，即`f(B(a))`   

*显式转换*：

- `X::operator T()` 
 - X => T
 - 特点是无返回类型 


>[!warning]
>上述两种转换方式不能同时具有，否则编译器不知道使用哪一个

---


### [1.34] 模板（Templates） {#anchor13}
We use templates to write **generic code** that is manageable, type-safe, and flexible across different data types.
- **Purpose**: Instead of overloading functions for every specific type (like `int`, `double`, etc.), templates allow us to define a single "blueprint." 

> [!important] EXAMPLE>_<       
>         
>       
>  ---            
>  Function Template:
>  ```cpp 
>  template <typename T>  
> void swap(T &x, T &y) {  // Pass by reference to allow modification
>      T temp = x;
>      x = y;
>      y = temp;
>  }
>  ```
>  - The `template` keyword indicates that the following block is a template.
>  - `T` is a **placeholder** for a type.
>  
>  ```cpp
>  float i = 4.5, j = 3.7;
>  swap(i, j); // The compiler deduces that T is float
> ```
>  
>  -  A template is actually a declaration. When `swap(i, j)` is called, the compiler generates a concrete version of the function for the `float` type. This process is called **instantiation**.

---

- 当模板和非模板函数同时存在，优先检查是否调用后者，构成overloading

>[!important] EXAMPLE>_<
>---   
>Class Template:
>```cpp
>template <class T>
>class Vector{
>public:
>	Vector(int);
>	~Vector();
>	Vector(const Vector &);
>	//……
>private:
>T *m_elements;
>int m_size;
>
>}
>```
>
>```
>//all functions inside the class template are function templates
>
>template
>Vector<T>::Vector(int size):m_size(size){
>	m_elements = new T[m_size];
>}
>
>
>//main
>Vector<int> v1(100);  //use the class template
>
>```
> 


> [!details]
> - 函数模板内涉及大小比较时，希望比较对象适用于任何类型（generic type），涉及重载运算符
> - 命名generic type时，习惯首字母大写（cpp默认类型int等均为小写）
> - template参数除了generic type，可以有默认参数
>  - `template<class T,int bounds=100>`
> - 嵌套
> 
> - 继承：继承自一个具体的类，而不是模板继承模板

---


### [1.36]异常 {#anchor14}
程序的异常大致可以分为两种：编译的error与运行时出错。尽管C++的设计角度能够在error层面做更多的排查，但后者依然是程序的主要问题原因。   
- 最简单的改进方式：    
  为所有语句添上`if-else`判断，依赖返回值判断（读取，写入）等等操作是否正常进行

但这种方式的问题也很显然：可读性大大降低，嵌套`if-else`使程序逻辑不清晰

---


> [!important] DEFINITION (๑˃ᴗ˂)ﻭ
> ---
> `throw`关键字
> 首先是中止当前函数运行
> 
> 例如，在一个数组index越界的问题中
> 
> ```cpp
> //类模板
> template <class T> class Vector{
> private:
> 	T* m_elements;
> 	int m_size;
> public:
> 	Vector(int size=0):m_size(size){}
> 	~Vector(){ delete [] m_elements;}
> 	void length(int);
> 	int length(){ return m_size;}
> 	T& operator[](int);  //需要异常处理
> };
> 
> //
>  template <class T>
>  T & Vextor<T>::operator[](int indx){
> 	 if(indx<0 || indx >= m_size){
> 	 //VectorIndexError e(indx);
> 	 //throw e;
> 	 throw VectorIndexError(indx); 
> 	 //函数不知道如何处理异常，所以抛出(throw)到外部
> 	 }
> 	 return m_elements[indx];
>  }
>
> //a class to represent the error
> class VectorIndexError{
> public:
> 	VectorIndexError(int v): m_badValue(v){}
> 	~VectorIndexError(){}
> 	void diagnostic(){
> 	cerr << "index" <<m_badValue<<"out of range!" ;}
> private:
> 	int m_badValue;
> 
> }
> ```
> 
> 当throw触发后，进行以下循环：
>  -  它所在语句（起初是`if-else`块）在此中止
>  - 检查`throw`是否在`try`块内         
>           
>    - 如果是，检查`catch`是否匹配
>    - 如果不是，跳出当前块直到跳出当前函数，回到调用处的上一级函数中
>      
>   
> ```cpp
> //越界产生的函数
> int func(){
> 	Vector<int> v(12);
> 	v[3]=5;
> 	int i=v[42];  //throw happens!
> 	
> 	return i* 5;
> }
> 
> void outer(){
> 	try{
> 		func(); func2();  //根据throw原则，func2()不被执行
> 	}catch(VectorIndexError& e){
> 	e.diagnostic();
> 	
> 	}
> }
> ```


- 异常的传播(propagation)：在`catch`内部进一步`throw`(语句后无对象，仍然处理当前异常对象)
- `catch(…)  //此为关键字` ：捕获任意异常

> [!Details]
> ```cpp
> //catch可以有多个
> try{
> 	
> }catch(){
> }catch(){
> }catch(){
> }
> ```
> 
> - 对于（正常阅读顺序进行依次查找）每个catch的“参数表”，按照如下顺序检查是否匹配，直到可以匹配到
> 	  - exact match
> 	  - base class conversions (base class catches a derived class,reference and pointer types,**only**)
> 	  - ellipses
>        
>        
> ```cpp
> void abc(int a):throw(MathErr){
> 	//限制此函数最多能抛出"MathErr"异常
> }
> ```
> 


未完待续……(⁄ ⁄•⁄ω⁄•⁄ ⁄)